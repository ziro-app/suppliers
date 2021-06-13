const axios = require("axios")
const arrayObject = require("@ziro/array-object")
const getSheet = require("./getSheet")
const postSheet = require("./postSheet")
const dataPostBatch = require("./dataPostBatch")
const { db } = require("../../../../Firebase")

const updateReceita = async (cnpj, obj, setErrorMsg, setState, zoopId) => {
  const {
    setNewReason,
    setNewFantasy,
    setNewCep,
    setNewAddress,
    setNewNeighborhood,
    setNewCity,
    setNewCityState,
  } = setState
  const config = {
    method: "POST",
    url: "https://ziro-sheets.netlify.app/.netlify/functions/api",
    data: {
      apiResource: "values",
      apiMethod: "get",
      spreadsheetId: "1YlNSmVrawtxeKyy-tDdmI9B0bgSIIQswBnl3CEgdRRo",
      range: "Base",
    },
    headers: {
      Authorization: process.env.SHEET_TOKEN,
      "Content-Type": "application/json",
    },
  }
  const {
    fantasia,
    cep,
    city: cidade,
    complement: complemento,
    cityState: estado,
    reason: razao,
    neighborhood: bairro,
    number: numero,
    street: logradouro,
  } = obj

  const cepSplit = cep.split("")
  cepSplit.splice(2, 0, ".")
  const dotCep = cepSplit.join("")

  try {
    const endereco = complemento ? `${logradouro}, ${numero}, ${complemento}` : `${logradouro}, ${numero}`
    const requestSheet = await axios(getSheet(["Base!A:U"]))
    const objectSheet = await arrayObject(requestSheet.data.valueRanges[0])
    const updateObj = {
      razao,
      fantasia,
      cep: dotCep,
      endereco,
      bairro,
      cidade,
      estado,
    }
    const arrayUpdate = dataPostBatch(objectSheet, "cnpj", cnpj, updateObj, "Base")
    await axios(postSheet(arrayUpdate))
    try {
      const query = db.collection("suppliers").where("cnpj", "==", cnpj)
      const idFirebase = []
      const snapshot = await query.get()
      snapshot.forEach(doc => {
        if (doc.data().cnpj === cnpj) {
          idFirebase.push(doc.id)
        }
      })
      if (idFirebase[0]) {
        await db.collection("suppliers").doc(idFirebase[0]).update(updateObj)
        try {
          await axios.post(
            `https://ziro-pay.netlify.app/.netlify/functions/sellers-update?seller_id=${zoopId}`,
            {
              business_name: razao || undefined,
              business_address: {
                line1: logradouro || undefined,
                line2: numero || undefined,
                line3: complemento || "",
                neighborhood: bairro || undefined,
                city: cidade || undefined,
                state: estado || undefined,
                postal_code: cep || undefined,
              },
            },
            {
              headers: {
                Authorization: `${process.env.PAY_TOKEN}`,
              },
            },
          )

          try {
            setNewReason(razao)
            setNewFantasy(fantasia)
            setNewCep(cep)
            setNewAddress(endereco)
            setNewNeighborhood(bairro)
            setNewCity(cidade)
            setNewCityState(estado)
            try {
              const dataStoreowners = await axios(config)
              const [, ...listStoreowners] = dataStoreowners.data.values
            } catch (error) {
              setErrorMsg("Erro ao fazer update na listagem do googleSheets")
              throw { msg: "erro storeoweners" }
            }
          } catch (error) {
            setErrorMsg("Erro ao atualizar os parametros, favor recarregar a página")
            throw { msg: "erro setState" }
          }
        } catch (error) {
          setErrorMsg("Erro ao atualizar os parâmetros na Zoop.")
          throw { msg: "error zoop" }
        }
      }
    } catch (error) {
      setErrorMsg("Planilha Salva, Erro ao salvar no Banco de Dados")
      console.log(error)
    }
  } catch (error) {
    setErrorMsg("Erro ao salvar na Planilha e no Banco de Dados")
    console.log(error)
  }
}

export default updateReceita

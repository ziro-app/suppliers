import React, { useState, useEffect, useContext } from "react"
import axios, { post } from "axios"
import { motion } from "framer-motion"
import { useLocation } from "wouter"
import Button from "@bit/vitorbarbosa19.ziro.button"
import Table from "@bit/vitorbarbosa19.ziro.table"
import Error from "@bit/vitorbarbosa19.ziro.error"
import Spinner from "@bit/vitorbarbosa19.ziro.spinner"
import Modal from "@bit/vitorbarbosa19.ziro.modal"
import { userContext } from "../appContext"
import { db } from "../../Firebase/index"
import fetch from "./fetch"
import {
  modalContainer,
  outerContainer,
  modalLabel,
  spinner,
  labelBody,
  modalBody,
  labelBodyContainer,
  containerButtons,
  customGrid,
  customCell,
  resultStyle,
} from "./styles"

const Collaborators = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [collaborators, setCollaborators] = useState([])
  const [dataTable, setDataTable] = useState([])
  const [collaboratorName, setCollaboratorName] = useState("")
  const [collaboratorEmail, setCollaboratorEmail] = useState("")
  const [collaboratorId, setCollaboratorId] = useState("")
  const [deleteResultText, setDeleteResultText] = useState("")
  const [deleteResultStatus, setDeleteResultStatus] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)
  const { docId } = useContext(userContext)
  const setState = {
    setIsLoading,
    setErrorLoading,
    setCollaborators,
    setDataTable,
    setCollaboratorName,
    setCollaboratorEmail,
    setCollaboratorId,
    setDeleteResultText,
    setDeleteResultStatus,
    setDeleteModal,
  }
  const state = {
    collaborators,
    dataTable,
    collaboratorName,
    collaboratorEmail,
    collaboratorId,
    deleteResultText,
    deleteResultStatus,
    deleteModal,
    ...setState,
  }
  const [, setLocation] = useLocation()
  const sheetUrl = process.env.SHEET_URL
  const sheetConfig = {
    headers: {
      "Content-type": "application/json",
      Authorization: process.env.SHEET_TOKEN,
    },
  }

  const findCollaboratorRow = async email => {
    const body = {
      apiResource: "values",
      apiMethod: "get",
      range: "Colaboradores",
      spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
    }
    let pos = 0
    const {
      data: { values },
    } = await post(sheetUrl, body, sheetConfig)
    values.map((user, index) => {
      if (user[2] === email) {
        pos = index + 1
      }
    })
    return pos
  }

  const successDelete = () => {
    setDeleteResultStatus(true)
    setDeleteResultText("Vendedor excluído com sucesso")
    setCollaboratorName("")
    setCollaboratorEmail("")
    setCollaboratorId("")
    setIsLoading(false)
    setTimeout(() => {
      setDeleteResultText("")
    }, 2500)
  }

  const failDelete = () => {
    setDeleteResultStatus(false)
    setDeleteResultText("Erro ao excluir vendedor")
    setCollaboratorName("")
    setCollaboratorEmail("")
    setCollaboratorId("")
    setIsLoading(false)
    setTimeout(() => {
      setDeleteResultText("")
    }, 2500)
  }

  const deleteCollaborator = async () => {
    setIsLoading(true)
    try {
      const docRefCollection = await db.collection("collaborators").doc(collaboratorId).get()
      const { uid } = docRefCollection.data()
      if (uid) {
        const config = {
          method: "POST",
          url: `${process.env.FIREBASE_AUTH_URL}deleteAuthUser`,
          data: { uid },
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.FIREBASE_AUTH_TOKEN,
          },
        }

        const { data } = await axios(config)
        if (data.ok) {
          const row = await findCollaboratorRow(collaboratorEmail)
          const body = {
            apiResource: "values",
            apiMethod: "update",
            range: `Colaboradores!E${row}`,
            spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
            resource: {
              values: [["Excluído"]],
            },
            valueInputOption: "raw",
          }
          if (row && row > 0) await post(sheetUrl, body, sheetConfig)

          const snapUser = await db.collection("users").where("email", "==", collaboratorEmail).get()
          let docRefUser
          snapUser.forEach(doc => (docRefUser = doc.ref))
          await docRefCollection.ref.delete()
          await docRefUser.delete()
          successDelete()
        } else failDelete()
      } else {
        await db.collection("collaborators").doc(collaboratorId).delete()
        successDelete()
      }
    } catch (error) {
      console.log(error)
      if (error.response) console.log(error.response)
      failDelete()
    }
  }

  useEffect(() => fetch(setIsLoading, setErrorLoading, docId, setState), [])

  if (isLoading)
    return (
      <div style={spinner}>
        <Spinner size="5.5rem" />
      </div>
    )
  if (errorLoading) return <Error />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={outerContainer(dataTable && dataTable.length !== 0)}
    >
      <div>
        <Modal boxStyle={modalContainer} isOpen={deleteModal} setIsOpen={() => setDeleteModal(false)}>
          <div style={modalBody}>
            <label style={modalLabel}>Deseja realmente remover o vendedor ?</label>
            <div style={labelBodyContainer}>
              <label style={labelBody}>{collaboratorName}</label>
              <label style={labelBody}>{collaboratorEmail}</label>
            </div>
            <div style={containerButtons}>
              <Button
                type="button"
                cta="Sim"
                click={async () => {
                  setDeleteModal(false)
                  await deleteCollaborator()
                }}
                template="regular"
              />
              <Button type="button" cta="Não" click={() => setDeleteModal(false)} template="light" />
            </div>
          </div>
        </Modal>
        <Table data={dataTable} customGrid={customGrid} cellStyle={customCell} />
      </div>
      <div>
        <Button
          type="button"
          cta="Convidar vendedor"
          click={() => setLocation("/convidar-colaborador")}
          template="regular"
        />
        {deleteResultText ? (
          <div style={resultStyle(deleteResultStatus)}>
            <span>{deleteResultText}</span>
          </div>
        ) : (
          <div style={{ padding: "0 0 5px", height: "24px" }}>&nbsp;</div>
        )}
      </div>
    </motion.div>
  )
}

export default Collaborators

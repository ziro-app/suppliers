import axios from 'axios';

const uploadDocuments = async (zoopId, idDoc, idAtv, idRes, idCnpj) => {
  
  const update = async () => {
    const uploadConfig = {
      url: `${process.env.DOC_URL}${zoopId}/documents`,
      method: 'post',
      params: {},
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': `${process.env.ZOOP_AUTH}`
      },
      data: {}
    };

    await Promise.all([idDoc, idAtv, idRes, idCnpj].map(async (file, index) => {
      try {
        if (file.size === 0) throw 'Empty sized image'
        let category
        if (index === 0) category = 'identificacao'
        else if (index === 1) category = 'atividade'
        else if (index === 2) category = 'residencia'
        else category = 'cnpj'
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        uploadConfig.data = formData
        await axios(uploadConfig)
      } catch (error) {
        if (error.customError) throw error
        throw { msg: `Erro no upload da imagem ${index + 1}, fale com seu assessor.`, customError: true }
      }
    }));
  };

  await update();
};

export default uploadDocuments;
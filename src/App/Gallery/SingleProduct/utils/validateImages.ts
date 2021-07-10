const validateImages = (images: File[]) => {
  images.map((image: File) => {
    if (!image) throw new Error(`Algumas das imagens selecionadas estão corrompidas`)
    if (!image.size) throw new Error(`Imagem de tamanho vazio não é permitida`)
    if (!image.name) throw new Error(`Imagem sem nome não é permitida`)
    const type = image.type && image.type.toLowerCase()
    const name = image.name.toLowerCase()
    const validationRegex = /jpg$|jpeg$|gif$|png$|bitmap$/g
    const extensionByType = validationRegex.test(type)
    const extensionByName = validationRegex.test(name)
    if (!extensionByType && !extensionByName)
      throw new Error(`Não foi encontrada extensão da foto "${image.name}". Deve ser: jpg, jpeg, gif, png, bitmap`)
  })
}

export default validateImages

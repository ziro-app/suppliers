export function removeImage({
  filesList,
  pictures,
  picture,
  setPictures,
  setFiles,
  setRemoveImageModal,
  identifierOfPicture,
  thumbPhoto,
  setThumbPhoto,
}) {
  const filteredPictures = pictures.filter(e => e.identifier !== identifierOfPicture)
  const filteredFiles = filesList.filter(e => e.identifierOfPicture !== identifierOfPicture)
  if (thumbPhoto.identifierOfPicture === identifierOfPicture) {
    if (filteredFiles.length === 0) setThumbPhoto('')
    else {
      const newThumbPhoto = filteredFiles[0].identifierOfPicture
      setThumbPhoto({ identifierOfPicture: newThumbPhoto })
    }
  }
  setPictures(filteredPictures)
  setFiles(filteredFiles)
  setRemoveImageModal(false)
}

export function duplicateImage({
  filesList,
  pictures,
  picture,
  setPictures,
  setFiles,
  setDuplicateImageModal,
  identifierOfPicture,
  uuid,
  index,
  dispatch,
}) {
  const filteredPicture = pictures.find(e => e.identifier === identifierOfPicture)
  const filteredFile = filesList.find(e => e.identifierOfPicture === identifierOfPicture)
  const uid = uuid()

  const file = filteredFile
  const data = new FormData()
  data.append('file', file, file.name)
  const _file = data.get('file')
  _file.identifierOfPicture = uid

  const newIndex = index + 1

  const newArrayFiles = filesList.slice()
  newArrayFiles.splice(newIndex, 0, _file)
  setFiles(newArrayFiles)

  const newArrayPictures = pictures.slice()
  const newPicture = { urlImage: filteredPicture.urlImage, identifier: uid }
  newArrayPictures.splice(newIndex, 0, newPicture)
  setPictures(newArrayPictures)

  const payload = {
    userValue: '',
    identifierOfPicture,
    inputType: 'duplicate',
    newIdentifier: uid,
  }
  dispatch(payload)

  setDuplicateImageModal(false)
}

export function inputStateControl(state, payload) {
  const { userValue, identifierOfPicture, inputType, newIdentifier } = payload
  switch (inputType) {
    case 'identifier':
      return { ...state, [`identifier${identifierOfPicture}`]: userValue }
    case 'initial': {
      //console.log('states inside function', state)
      return {
        ...state,
        [`identifier${identifierOfPicture}`]: identifierOfPicture,
        [`sizes${identifierOfPicture}`]: ['P', 'M', 'G'],
        [`colors${identifierOfPicture}`]: [''],
        [`sizesCart${identifierOfPicture}`]: ['P', 'M', 'G'],
        [`colorsCart${identifierOfPicture}`]: [''],
        [`typeSize${identifierOfPicture}`]: 'letter',
        [`discount${identifierOfPicture}`]: '',
        [`discountCart${identifierOfPicture}`]: '',
        [`price${identifierOfPicture}`]: '',
        [`description${identifierOfPicture}`]: '',
      }
    }
    case 'description':
      return { ...state, [`description${identifierOfPicture}`]: userValue }
    case 'price':
      return { ...state, [`price${identifierOfPicture}`]: userValue }
    case 'discount':
      return { ...state, [`discount${identifierOfPicture}`]: userValue }
    case 'sizes':
      return { ...state, [`sizes${identifierOfPicture}`]: userValue }
    case 'colors':
      return { ...state, [`colors${identifierOfPicture}`]: userValue }
    case 'discountCart':
      return { ...state, [`discountCart${identifierOfPicture}`]: userValue }
    case 'sizesCart':
      return { ...state, [`sizes${identifierOfPicture}`]: userValue }
    case 'colorsCart':
      return { ...state, [`colors${identifierOfPicture}`]: userValue }
    case 'typeSize':
      return { ...state, [`typeSize${identifierOfPicture}`]: userValue }
    case 'referenceId':
      return { ...state, [`referenceId${identifierOfPicture}`]: userValue }
    case 'availability':
      return { ...state, [`availability${identifierOfPicture}`]: userValue }
    case 'availableQuantities':
      return {
        ...state,
        [`availableQuantities${identifierOfPicture}`]: userValue,
      }
    case 'availableQuantitiesCart':
      return {
        ...state,
        [`availableQuantitiesCart${identifierOfPicture}`]: userValue,
      }
    case 'clear':
      return { ...(state = {}) }

    case 'duplicate':
      return {
        ...state,
        [`identifier${newIdentifier}`]: newIdentifier,
        [`availableQuantities${newIdentifier}`]: state[`availableQuantities${identifierOfPicture}`],
        [`colors${newIdentifier}`]: state[`colors${identifierOfPicture}`],
        [`sizes${newIdentifier}`]: state[`sizes${identifierOfPicture}`],
        [`typeSize${newIdentifier}`]: state[`typeSize${identifierOfPicture}`],
        [`discount${newIdentifier}`]: state[`discount${identifierOfPicture}`],
        [`price${newIdentifier}`]: state[`price${identifierOfPicture}`],
        [`description${newIdentifier}`]: state[`description${identifierOfPicture}`],
      }
    case 'fetchedItem':
      return {
        ...state,
        [`availableQuantities${identifierOfPicture}`]: userValue.availableQuantities,
        [`colors${identifierOfPicture}`]: userValue.colors,
        [`sizes${identifierOfPicture}`]: userValue.sizes,
        //[`typeSize${identifierOfPicture}`]: userValue.typeSize,
        [`discount${identifierOfPicture}`]: userValue.discount,
        [`price${identifierOfPicture}`]: userValue.price,
        [`description${identifierOfPicture}`]: userValue.description,
      }
    default:
    // code block
  }
}

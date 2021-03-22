const imgExtension = ['.jpg', '.jpeg', '.gif', '.png'];

const maxFileSize = 5242880;

export function hasExtension(fileName) {
  const pattern = `(${imgExtension.join('|').replace(/\./g, '\\.')})$`;
  return new RegExp(pattern, 'i').test(fileName);
}

export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Read the image via FileReader API and save image result in state.
    reader.onload = function (e) {
      // Add the file name to the data URL
      let dataURL = e.target.result;
      dataURL = dataURL.replace(';base64', `;name=${file.name};base64`);
      resolve({ file, dataURL });
    };

    reader.readAsDataURL(file);
  });
}

export function onDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
}

export function onUploadClick(e) {
  e.target.value = null;
}

export function removeImage({ filesList, pictures, picture, setPictures, setFiles, setRemoveImageModal, identifierOfPicture, thumbPhoto, setThumbPhoto }) {
  const filteredPictures = pictures.filter(e => e.identifier !== identifierOfPicture);
  const filteredFiles = filesList.filter(e => e.identifierOfPicture !== identifierOfPicture);
  if (thumbPhoto.identifierOfPicture === identifierOfPicture) {
    if (filteredFiles.length === 0) setThumbPhoto('');
    else {
      const newThumbPhoto = filteredFiles[0].identifierOfPicture;
      setThumbPhoto({ identifierOfPicture: newThumbPhoto });
    }
  }
  setPictures(filteredPictures);
  setFiles(filteredFiles);
  setRemoveImageModal(false);
}

export function duplicateImage({ filesList, pictures, picture, setPictures, setFiles, setDuplicateImageModal, identifierOfPicture, uuid, index, dispatch }) {
  const filteredPicture = pictures.find(e => e.identifier === identifierOfPicture);
  const filteredFile = filesList.find(e => e.identifierOfPicture === identifierOfPicture);
  const uid = uuid();
  const uidInputs = uuid();
  const file = filteredFile;
  const data = new FormData();
  data.append('file', file, file.name);
  const _file = data.get('file');
  _file.identifierOfPicture = uid;

  const newIndex = index + 1;

  const newArrayFiles = filesList.slice();
  newArrayFiles.splice(newIndex, 0, _file);
  setFiles(newArrayFiles);

  const newArrayPictures = pictures.slice();
  const newPicture = { urlImage: filteredPicture.urlImage, identifier: uid, identifierInputs: uidInputs };
  newArrayPictures.splice(newIndex, 0, newPicture);
  setPictures(newArrayPictures);

  const payload = {
    userValue: '',
    identifierOfPicture,
    inputType: 'duplicate',
    newIdentifier: uid,
  };
  dispatch(payload);

  setDuplicateImageModal(false);
}

export function settingThePicturesAndFiles(files, setIsError, pictures, filesList, setPictures, setFiles, uuid, states, dispatch, thumbPhoto, setThumbPhoto) {
  const allFilePromises = [];
  const fileErrors = [];
  // Iterate over all uploaded files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let fileError = {
      name: file.name,
    };
    // Check for file extension
    if (!hasExtension(file.name)) {
      fileError = Object.assign(fileError, {
        type: 'Extensão não permitida',
      });
      fileErrors.push(fileError);
      continue;
    }
    // Check for file size
    if (file.size > maxFileSize) {
      fileError = Object.assign(fileError, {
        type: 'Imagem grande demais',
      });
      fileErrors.push(fileError);
      continue;
    }

    file.identifierOfPicture = uuid();
    file.identifierInputs = uuid();
    if (i === 0 && !thumbPhoto) {
      const firstUid = file.identifierOfPicture;
      setThumbPhoto({ ...thumbPhoto, identifierOfPicture: firstUid });
    }
    allFilePromises.push(readFile(file));
  }

  setIsError(fileErrors);

  Promise.all(allFilePromises).then(newFilesData => {
    const dataURLs = pictures.slice();
    const files = filesList.slice();

    newFilesData.forEach(newFileData => {
      const data = {};
      data.urlImage = newFileData.dataURL;
      data.identifier = newFileData.file.identifierOfPicture;
      dataURLs.push(data);
      files.push(newFileData.file);

      const payload = {
        userValue: '',
        identifierOfPicture: data.identifier,
        inputType: 'initial',
      };
      dispatch(payload);
    });
    setPictures(dataURLs);
    setFiles(files);
  });
}

export function inputStateControl(state, payload) {
  const { userValue, identifierOfPicture, inputType, newIdentifier } = payload;
  switch (inputType) {
    case 'identifier':
      return { ...state, [`identifier${identifierOfPicture}`]: userValue };
    case 'initial':
      return {
        ...state,
        // [`availableQuantities${identifierOfPicture}`]: {"-G": "3", "-P": "3", "-M": "3"},
        [`sizes${identifierOfPicture}`]: ['P', 'M', 'G'],
        [`colors${identifierOfPicture}`]: [''],
        [`typeSize${identifierOfPicture}`]: 'letter',
        [`discount${identifierOfPicture}`]: '',
        [`price${identifierOfPicture}`]: '',
        [`description${identifierOfPicture}`]: '',
      };
    case 'description':
      return { ...state, [`description${identifierOfPicture}`]: userValue };
    case 'price':
      return { ...state, [`price${identifierOfPicture}`]: userValue };
    case 'discount':
      return { ...state, [`discount${identifierOfPicture}`]: userValue };
    case 'sizes':
      return { ...state, [`sizes${identifierOfPicture}`]: userValue };
    case 'colors':
      return { ...state, [`colors${identifierOfPicture}`]: userValue };
    case 'typeSize':
      return { ...state, [`typeSize${identifierOfPicture}`]: userValue };
    case 'referenceId':
      return { ...state, [`referenceId${identifierOfPicture}`]: userValue };
    case 'availableQuantities':
      return {
        ...state,
        [`availableQuantities${identifierOfPicture}`]: userValue,
      };
    case 'clear':
      return { ...(state = {}) };

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
      };
    default:
    // code block
  }
}

export function getMostRecentImage(uploadResult) {
  uploadResult.reduce(([prevUrl, prevTime], [currentUrl, currentTime]) => (prevTime > currentTime ? [prevUrl, prevTime] : [currentUrl, currentTime]));
}

export function getThumbImage(uploadResult) {
  uploadResult.reduce(([prevUrl, prevTime, prevIdentifierOfPicture], [currentUrl, currentTime, currentIdentifierOfPicture]) =>
    prevIdentifierOfPicture === currentIdentifierOfPicture ? [prevUrl, prevTime, prevIdentifierOfPicture] : [currentUrl, currentTime, currentIdentifierOfPicture],
  );
  console.log('uploadResult', uploadResult);
}

export function isValidBrand(brands, brand) {
  if (!(brands instanceof Array)) return false;
  if (brands.length === 0) return false;

  return brands.map(brand => brand.toUpperCase()).includes(brand);
}

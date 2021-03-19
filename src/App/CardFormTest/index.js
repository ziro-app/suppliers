import React, { useState, memo } from 'react'
import RImg from 'react-image'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import CardInputs from './cardInputs'
import {
  fileContainerUploadPictureContainerClass,
  fileContainerUploadPictureContainerimgUploadPictureClass,
  fileContainerUploadPicturesWrapperClass,
  image,
} from './styles'
import InfoCard from './infoCard'
import SummaryCard from './summaryCard'
import CardControls from './CardControls'

const PTstatus = {
  available: 'Disponível',
  unavailable: 'Indisponível',
  closed: 'Disponível',
  waitingInfo: '',
  soldOut: 'Indisponível',
}

const INstatus = {
  Disponível: 'available',
  Indisponível: 'soldOut',
}

export default memo(
  ({
    product,
    filesList,
    setFiles,
    index,
    picture,
    removeImage,
    update,
    cardInfo = false,
    editing,
    cartProduct,
    setEditing,
    validations,
    state,
    arrayOfInputs,
    pictures,
    setPictures,
    initialStatus,
    dispatch,
    duplicateImage,
    identifierOfPicture,
    uuid,
    thumbPhoto,
    setThumbPhoto,
    secondArrayOfInputs,
  }) => {
    //console.log('index inside cardForm.', index)
    const [removeImageModal, setRemoveImageModal] = useState(false)
    const [duplicateImageModal, setDuplicateImageModal] = useState(false)
    return (
      <div style={fileContainerUploadPicturesWrapperClass} className="uploadPicturesWrapper">
        <div key={index} style={fileContainerUploadPictureContainerClass} className="uploadPictureContainer">
          <CardControls
            duplicateImage={duplicateImage}
            filesList={filesList}
            pictures={pictures}
            picture={picture}
            setPictures={setPictures}
            setFiles={setFiles}
            setDuplicateImageModal={setDuplicateImageModal}
            identifierOfPicture={identifierOfPicture}
            uuid={uuid}
            index={index}
            dispatch={dispatch}
            duplicateImageModal={duplicateImageModal}
            removeImage={removeImage}
            setRemoveImageModal={setRemoveImageModal}
            thumbPhoto={thumbPhoto}
            setThumbPhoto={setThumbPhoto}
            removeImageModal={removeImageModal}
          />

          {cardInfo ? (
            <RImg
              src={product.url}
              style={image}
              container={children =>
                !initialStatus || initialStatus === 'waitingInfo' || editing ? (
                  <CardInputs
                    image={children || null}
                    update={update || null}
                    index={index}
                    arrayOfInputs={arrayOfInputs}
                    validations={validations}
                    secondArrayOfInputs={secondArrayOfInputs}
                  />
                ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
                  <InfoCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                ) : (
                  <SummaryCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                )
              }
              loaderContainer={() => <SpinnerWithDiv />}
            />
          ) : (
            <RImg
              src={picture}
              style={fileContainerUploadPictureContainerimgUploadPictureClass}
              alt="preview"
              container={children => (
                <CardInputs disabled image={children || null} update={update || null} arrayOfInputs={arrayOfInputs} validations={[]} index={index} />
              )}
            />
          )}
        </div>
      </div>
    )
  },
)

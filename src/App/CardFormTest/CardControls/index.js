import React, { memo } from 'react'
import { buttonsDuplicateRemoveContainer, caption, checkboxContainer, container } from './styles'
import DuplicateImageButton from './Buttons/DuplicateButton'
import RemoveImageButton from './Buttons/RemoveImageButton'
import CheckBoxThumbPhoto from './Buttons/CheckBoxThumbButton'
import ModalComponent from './Modal'

const CardControls = ({
  duplicateImage,
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
  duplicateImageModal,
  removeImage,
  setRemoveImageModal,
  thumbPhoto,
  setThumbPhoto,
  removeImageModal,
}) => {
  return (
    <div style={container}>
      {setThumbPhoto ? (
        <div style={checkboxContainer}>
          <CheckBoxThumbPhoto thumbPhoto={thumbPhoto} setThumbPhoto={setThumbPhoto} identifierOfPicture={identifierOfPicture} />
          <div style={caption}>Capa</div>
        </div>
      ) : (
        <div />
      )}
      <div style={buttonsDuplicateRemoveContainer}>
        <div>
          <DuplicateImageButton setDuplicateImageModal={setDuplicateImageModal} />
          <ModalComponent
            onClickFunction={duplicateImage}
            openState={duplicateImageModal}
            setOpenState={setDuplicateImageModal}
            states={{
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
            }}
            labelText="Deseja realmente duplicar a imagem?"
          />
        </div>
        <div>
          <RemoveImageButton setRemoveImageModal={setRemoveImageModal} />
          <ModalComponent
            onClickFunction={removeImage}
            openState={removeImageModal}
            setOpenState={setRemoveImageModal}
            states={{
              filesList,
              pictures,
              picture,
              setPictures,
              setFiles,
              setRemoveImageModal,
              identifierOfPicture,
              thumbPhoto,
              setThumbPhoto,
            }}
            labelText="Deseja realmente excluir a imagem?"
          />
        </div>
      </div>
    </div>
  )
}

CardControls.propTypes = {}

export default memo(CardControls)

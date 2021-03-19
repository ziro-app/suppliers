/* eslint-disable no-nested-ternary */
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import RImg from 'react-image';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import Form from '@bit/vitorbarbosa19.ziro.form'
import { fileContainerUploadPictureContainerClass, fileContainerUploadPictureContainerimgUploadPictureClass, fileContainerUploadPicturesWrapperClass, image } from './styles';

import CardControls from './CardControls';
import CardInputs from './cardInputs';
import InfoCard from './infoCard';
import SummaryCard from './summaryCard';
// import CardControls from './CardControls'

const PTstatus = {
  available: 'Disponível',
  unavailable: 'Indisponível',
  closed: 'Disponível',
  waitingInfo: '',
  soldOut: 'Indisponível',
};

const INstatus = {
  Disponível: 'available',
  Indisponível: 'soldOut',
};
const CardInput = ({ update, image, arrayOfInputs, validations }) => {
    const _inputs = arrayOfInputs;

    const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', borderRadius: '5px' }}>

            <div style={{ padding: '10px 10px 30px' }}>
                <Form validations={[]} sendToBackend={update || null} inputs={inputs}/>
            </div>
        </div>
    );
};

export default memo(
  ({
    test,
    product,
    WindowedRow,
    register,
    filesList,
    setFiles,
    index,
    picture,
    removeImage,
    update,
    updateCarts,
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
    //const { register, handleSubmit, watch, errors } = useForm();
    //const onSubmit = data => console.log(data);
    //console.log('index inside cardForm', index);
    //console.log('test inside cardForm', test);
    //console.log('product', product); só uso para o carrinho editável
    //console.log(cardInfo);
    const [removeImageModal, setRemoveImageModal] = useState(false);
    const [duplicateImageModal, setDuplicateImageModal] = useState(false);
    //console.log('cardInfo',cardInfo)
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
                editing || !initialStatus || initialStatus === 'waitingInfo' ? (
                  <>
                    <CardInputs
                      image={children || null}
                      update={update || null}
                      updateCarts={updateCarts || null}
                      index={index}
                      arrayOfInputs={arrayOfInputs}
                      validations={validations}
                      secondArrayOfInputs={secondArrayOfInputs}
                      product={product}
                      setEditing={setEditing}
                    />
                  </>
                ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
                  <InfoCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                ) : (
                  <SummaryCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                )
              }
              loaderContainer={() => <SpinnerWithDiv />}
            />
          ) : (
            <>
              <img src={picture} style={fileContainerUploadPictureContainerimgUploadPictureClass} alt="Upload" />
              <CardInput disabled image={picture || null} update={update || null} arrayOfInputs={arrayOfInputs} validations={[]} index={index} />

              {/* <RImg src={picture} style={fileContainerUploadPictureContainerimgUploadPictureClass} alt="preview" />
              <input
                name={`test1${identifierOfPicture}`}
                key={`test1${identifierOfPicture}`}
                // Rather than ref={register}, we use defaultValue and setValue
                // key={uuid}
                defaultValue="teste"
                ref={register}
              />
              <input
                name={`test2${identifierOfPicture}`}
                key={`test2${identifierOfPicture}`}
                // Rather than ref={register}, we use defaultValue and setValue
                // key={uuid}
                defaultValue="teste"
                ref={register}
              />
              <input
                name={`test3${identifierOfPicture}`}
                key={`test3${identifierOfPicture}`}
                // Rather than ref={register}, we use defaultValue and setValue
                // key={uuid}
                defaultValue="teste"
                ref={register}
              /> */}
            </>
          )}
        </div>
      </div>
    );
  },
);

import React, { useContext, useEffect, useReducer, useState, useMemo, memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useRoute } from 'wouter';
import Button from '@bit/vitorbarbosa19.ziro.button';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { v4 as uuid } from 'uuid';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Form from '@bit/vitorbarbosa19.ziro.form';
import maskInput from '@ziro/mask-input';
import { Virtuoso } from 'react-virtuoso';
import Header from '@bit/vitorbarbosa19.ziro.header';
import fetch from './fetch';
import { cardContainerClass, fileContainerClass } from './styles';
import sendToBackend from './sendToBackend';
import { duplicateImage, inputStateControl, isValidBrand, onDragOver, removeImage, settingThePicturesAndFiles } from './functionsUploadImages';
import Card from '../CardForm';
import inputs from './inputs';
import EditProducts from './EditProducts';
import ToastNotification from '../ToastNotification';
import { userContext } from '../appContext';
import Empty from './Empty';
import { db } from '../../Firebase';

const sendDefaultValueToState = ({ value, color, size, states, identifierOfPicture, dispatch }) => {
  if (/^[0-9]*$/gm.test(value)) {
    const result = old => {
      const newQuantities = { ...(states[`availableQuantities${identifierOfPicture}`] || {}) };
      newQuantities[`${color}-${size}`] = maskInput(value, '##', true);
      return { ...old, availableQuantities: newQuantities };
    };
    const payload = {
      userValue: result().availableQuantities,
      identifierOfPicture,
      inputType: 'availableQuantities',
    };
    dispatch(payload);
  }
};

const WindowedRow = React.memo(({ style, data, register, uuid }) => {
  console.log('style, data, setValue, uuid', style, data, register, uuid);
  return (
    <input
      // Rather than ref={register}, we use defaultValue and setValue
      // key={uuid}
      defaultValue="teste"
      ref={register()}
    />
  );
});
const CardInput = ({ update, image, arrayOfInputs, validations }) => {
  const _inputs = arrayOfInputs;

  const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', borderRadius: '5px' }}>
      {image && image}
      <div style={{ padding: '10px 10px 30px' }}>
        <Form validations={[]} sendToBackend={update || null} inputs={inputs} />
      </div>
    </div>
  );
};
const WindowedCard = ({ data, index, style }) => {
  // console.log('data', data);
  const { sendDefaultValueToState, pictures, states, filesList, dispatch, defaultQuantityValue, device, isSubmitting, setFiles, setPictures, thumbPhoto, setThumbPhoto } = data;
  // console.log('style', style);
  // picture, states, filesList, setFiles, index, dispatch, defaultQuantityValue, device, isSubmitting, pictures, setPictures, thumbPhoto, setThumbPhoto
  // sendDefaultValueToState({value:defaultQuantityValue,color:pictures[index].color,size:pictures[index].size,states,identifierOfPicture:pictures[index].identifier,dispatch})
  return (
    <div style={{ ...style, width: '95%' }}>
      <Card
        key={pictures[index].identifier}
        test={pictures[index].identifier}
        identifierOfPicture={pictures[index].identifier}
        states={states}
        filesList={filesList}
        setFiles={setFiles}
        index={index}
        picture={pictures[index].urlImage}
        removeImage={removeImage}
        duplicateImage={duplicateImage}
        arrayOfInputs={inputs(states, pictures[index].identifier, dispatch, defaultQuantityValue, device, isSubmitting)}
        pictures={pictures}
        setPictures={setPictures}
        dispatch={dispatch}
        uuid={uuid}
        thumbPhoto={thumbPhoto}
        setThumbPhoto={setThumbPhoto}
      />
    </div>
  );
};

function titleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const UploadImages = params => {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandsAndTrends, setBrandsAndTrends] = useState('');
  const [brand, setBrand] = useState('');
  const [pictures, setPictures] = useState([]);
  const [filesList, setFiles] = useState([]);
  const [dataForList, setDataForList] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showButtonTop, setShowButtonTop] = useState(false);
  const [showButtonBot, setShowButtonBot] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [typeOfToast, setTypeOfToast] = useState('alert');
  const [messageToast, setMessageToast] = useState('');
  const [thumbPhoto, setThumbPhoto] = useState('');
  const [oldPictures, setOldPictures] = useState(['']);
  const [states, dispatch] = useReducer((state, payload) => inputStateControl(state, payload), {});
  const { cartId } = params;
  const [matchAdd] = useRoute('/produtos/adicionar');
  const [matchAddCart] = useRoute('/produtos/adicionar/:cartId?');
  const match = matchAdd || matchAddCart;
  console.log('match', match);
  const cartString = localStorage.getItem('cart');
  const cartObject = JSON.parse(cartString);
  // localStorage.removeItem('cart')
  console.log('cartObject', cartObject);
  // const { cartIds, onCartPress } = useCart(cartId, cartObject);
  const element = document.getElementById('dropzone');

  useEffect(() => {
    if (element) element.classList.remove('dropzone');
  }, [element]);

  const defaultQuantityValue = 2;
  const { device, fantasy } = useContext(userContext);
  const context = useContext(userContext);
  useEffect(() => {
    if (!match) {
      setIsLoading(false);
      return;
    }
    fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends);
  }, []);
  useEffect(() => {
    if (filesList.length === 0) setThumbPhoto('');
  }, [filesList]);

  useEffect(() => {
    if (pictures[0]) setShowButtonBot(true);
    else setShowButtonBot(false);
    if (pictures[1]) setShowButtonTop(true);
    else setShowButtonTop(false);
    if (oldPictures !== pictures) setOldPictures(pictures);
  }, [pictures]);

  useEffect(() => {
    console.log('isValidBrand', isValidBrand(brands, fantasy));
    if (!match) return;
    if (isValidBrand(brands, fantasy) && brands.filter(item => fantasy.includes(item.toUpperCase()))[0]) {
      setBrand(brands.filter(item => fantasy.includes(item.toUpperCase()))[0]);
      setShowUpload(true);
    } else {
      const brandFormattedForCatalogBrands = titleCase(context.fantasy);
      console.log('brand inside index', brandFormattedForCatalogBrands);
      console.log('fantasy inside index', fantasy);
      const snapRef = db.collection('catalog-brands');
      console.log(brands);
      console.log(brands.filter(item => item === brandFormattedForCatalogBrands));
      if (brands.length === 0) return;
      if (brands.filter(item => item === brandFormattedForCatalogBrands).length > 0) return;

      snapRef
        .add({ brand: brandFormattedForCatalogBrands, freeShipping: 'não', minimumItemQty: 0, trends: [], updatedAt: 0, updatedLoggedThumb: '', updatedThumb: '', withoutImages: true })
        .then(setBrands([...brands, brandFormattedForCatalogBrands]));

      setShowUpload(false);
    }
  }, [brands, fantasy]);

  useEffect(() => {
    if (!match) return;
    const data = { sendDefaultValueToState, pictures, states, filesList, dispatch, defaultQuantityValue, device, isSubmitting, setFiles, setPictures, thumbPhoto, setThumbPhoto };
    setDataForList(data);
  }, [filesList]);

  console.log(brand);

  if (isLoading) return <Spinner size="5rem" />;
  // if (isError) return <Error />;
  const state = {
    cartId,
    setIsSubmitting,
    setIsSubmitted,
    setBrand,
    states,
    brand,
    brandsAndTrends,
    filesList,
    setPictures,
    setFiles,
    dispatch,
    thumbPhoto,
    setThumbPhoto,
    setOpenToast,
    setMessageToast,
    setTypeOfToast,
    setLocation,
  };
  if (!match) return <EditProducts />;
  console.log('filesList',filesList)
  return (
    <>
      {/* <BrandChoose isSubmitting={isSubmitting} brand={brand} setBrand={setBrand} brands={brands} /> */}
      <div className="fileContainer" onDragOver={onDragOver}>
        <ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast} messageToastRoot={messageToast} type={typeOfToast} />
        {showUpload ? (
          <>
            <ImageUpload
              id="dropzone"
              sendToBackend={data => settingThePicturesAndFiles(data, setIsError, pictures, filesList, setPictures, setFiles, uuid, states, dispatch, thumbPhoto, setThumbPhoto)}
              isDisabled={!brands.filter(item => fantasy.includes(item.toUpperCase()))[0] || isValidBrand(brands, brand) || isSubmitting}
            />
            <div style={{ cardContainerClass }}>
              {showButtonTop && (
                <>
                  <Button click={() => sendToBackend(state)} submitting={isSubmitting} cta="Enviar todos produtos" type="button" />
                </>
              )}

              {showButtonBot && pictures === oldPictures && (
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: '1 1 auto', height: '100vh' }}>
                    {/* <List
                    itemCount={pictures.length}
                    itemData={{ sendDefaultValueToState, pictures, states, filesList, dispatch, defaultQuantityValue, device, isSubmitting, setFiles, setPictures, thumbPhoto, setThumbPhoto }}
                    itemSize={() => 1200}
                    width={device === 'smallMobile' ? 296 : 476}
                    height={window.innerHeight}
                    overscanCount={3}
                  >
                    {WindowedCard}
                  </List> */}
                    <AutoSizer defaultHeight={2000} defaultWidth={800}>
                      {({ width, height }) => {
                        console.log(width, height);
                        return (
                          <Virtuoso
                            useWindowScroll
                            style={{ height, width }}
                            data={filesList}
                            overscan={10}
                            components={{
                              Footer: () => {
                                return (
                                  <div
                                    style={{
                                      marginTop: '50px',
                                      marginBottom: '50px',
                                    }}
                                  >
                                    <Button click={() => sendToBackend(state)} submitting={isSubmitting} cta="Enviar todos produtos" type="button" />
                                  </div>
                                );
                              },
                            }}
                            itemContent={(index, data) => {
                              console.log('dataForList inside virtuoso', data);
                              // const { sendDefaultValueToState, pictures, states, filesList, dispatch, defaultQuantityValue, device, isSubmitting, setFiles, setPictures, thumbPhoto, setThumbPhoto } = dataForList;
                              // console.log('style', style);
                              // picture, states, filesList, setFiles, index, dispatch, defaultQuantityValue, device, isSubmitting, pictures, setPictures, thumbPhoto, setThumbPhoto
                              // sendDefaultValueToState({value:defaultQuantityValue,color:pictures[index].color,size:pictures[index].size,states,identifierOfPicture:pictures[index].identifier,dispatch})
                              return (
                                <div style={{ marginTop: '2rem' }}>
                                  <Card
                                    key={pictures[index].identifier}
                                    test={pictures[index].identifier}
                                    identifierOfPicture={pictures[index].identifier}
                                    states={states}
                                    filesList={filesList}
                                    setFiles={setFiles}
                                    index={index}
                                    picture={pictures[index].urlImage}
                                    removeImage={removeImage}
                                    duplicateImage={duplicateImage}
                                    arrayOfInputs={inputs(states, pictures[index].identifier, dispatch, defaultQuantityValue, device, isSubmitting)}
                                    pictures={pictures}
                                    setPictures={setPictures}
                                    dispatch={dispatch}
                                    uuid={uuid}
                                    thumbPhoto={thumbPhoto}
                                    setThumbPhoto={setThumbPhoto}
                                  />
                                </div>
                              );
                            }}
                          />
                        );
                      }}
                    </AutoSizer>
                  </div>
                </div>
              )}

              {/* pictures === oldPictures &&
                pictures.map((picture, index) => {
                  //console.log('index inside the MAP UploadImages', index);
                  //console.log('picture inside the MAP UploadImages', picture);
                  return (
                    <>
                      <Card
                        key={picture.identifier}
                        test={picture.identifier}
                        identifierOfPicture={picture.identifier}
                        states={states}
                        register={register}
                        filesList={filesList}
                        setFiles={setFiles}
                        index={index}
                        picture={picture.urlImage}
                        removeImage={removeImage}
                        duplicateImage={duplicateImage}
                        arrayOfInputs={inputs(states, picture.identifier, dispatch, defaultQuantityValue, device, isSubmitting)}
                        pictures={pictures}
                        setPictures={setPictures}
                        dispatch={dispatch}
                        uuid={uuid}
                        thumbPhoto={thumbPhoto}
                        setThumbPhoto={setThumbPhoto}
                      />
                    </>
                  );
                }) */}
            </div>
          </>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};
export default memo(UploadImages);

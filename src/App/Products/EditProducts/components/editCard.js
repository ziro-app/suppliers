/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-else-return */
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import DropDown from '@bit/vitorbarbosa19.ziro.dropdown';
import { useRoute, useLocation } from 'wouter';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import RImg from 'react-image';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { ZiroPromptMessage, ZiroWaitingMessage } from 'ziro-messages';
import Card from '../../../CardForm';
//import { cartItemFinder, idReducer, parseTotal, rqReducer, statusReducer } from './utils';
import { inputStateControl } from '../utils/functionsProductsEdit';
import { cartItemProductAdder, cartItemProductSubtracter, updateProductStock } from '../utils/transactions';
import { card } from '../styles';
import { db, fs } from '../../../../Firebase';
import { userContext } from '../../../appContext';
import ToastNotification from '../../../ToastNotification';
import InfoCard from './infoCard';
import SummaryCard from './summaryCard';
import TrashButton from './trashButton';

import EditCardCatalog from '../components/EditCardCatalog';

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

export default ({
  productCart,
  product,
  setProduct,
  state,
  cartProduct,
  setPromiseMessage,
  setMessage,
  brandName,
  buyerStoreownerId,
  image,
  update,
  productId,
  setURL,
  setPrice,
  initialStatus,
  setInitialStatus,
}) => {
  // console.log('buyerStoreownerId, image,  update, productId',buyerStoreownerId, image,  update, productId)
  console.log('productId', productId);
  //const productCart = product;
  //console.log('productCart', productCart);
  const cardInfo = true;
  const [openToast, setOpenToast] = useState(false);
  const [typeOfToast, setTypeOfToast] = useState('alert');
  const [messageToast, setMessageToast] = useState('');
  const [identifierOfPicture, setIdentifierOfPicture] = useState(uuid());
  const [productRef] = useState(db.collection('catalog-images').doc(productId));
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [editing, setEditing] = useState(false);
  //const [product, setProduct] = useState({ discount: '' });
  const [oldProduct, setOldProduct] = useState({ ...productCart, discount: '' });
  const [cartProductUpdate, setCartProductUpdate] = useState({
    status: 'available',
    identifierOfPicture,
  });
  const [location, setLocation] = useLocation();
  const cartId = useMemo(() => {
    console.log('location');
    return location.split('/')[2];
  }, [location]);
  //console.log('location',location.split('/')[2])
  //const [initialStatus, setInitialStatus] = useState('waitingInfo');
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [typeSize, setTypeSize] = useState('');
  const [sizesUpdate, setSizesUpdate] = useState([]);
  const [colorsUpdate, setColorsUpdate] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const { device } = useContext(userContext);
  const defaultQuantityValue = 2;
  const [states, dispatch] = useReducer((state, payload) => inputStateControl(state, payload), {});
  const [isDeleting, setIsDeleting] = useState(false);

  const PromptMessage = new ZiroPromptMessage({
    name: 'promptEditionProduct',
    type: 'neutral',
    code: '201',
    title: 'Modificação no produto',
    userDescription: isDeleting ? 'Irá apagar o produto' : 'Irá modificar o produto',
    userResolution: 'Deseja continuar?',
    internalDescription: 'prompt change of product',
    illustration: 'onlyVestuary',
    additionalData: undefined,
  });
  const WaitingMessage = new ZiroWaitingMessage({
    name: 'waitingEditionProduct',
    type: 'neutral',
    code: '202',
    title: isDeleting ? 'Apagando Produto' : 'Editando Produto',
    userDescription: isDeleting ? 'Apagando o produto, aguarde enquanto finalizamos' : 'Efetuando a mudança. Aguarde enquanto finalizamos.',
    internalDescription: 'waiting change of product',
    illustration: 'waiting',
    additionalData: undefined,
  });

  const FailureMessage = new ZiroPromptMessage({
    name: 'failureEditionProduct',
    type: 'destructive',
    code: '204',
    title: 'Falha',
    userDescription: 'Falha ao atualizar de modificar produto, tente novamente.',
    userResolution: 'Clique em ok para sair.',
    internalDescription: 'prompt de falha',
    illustration: 'errorLoading',
    additionalData: undefined,
  });

  const SuccessMessage = new ZiroPromptMessage({
    name: 'successEditionProduct',
    type: 'success',
    code: '203',
    title: 'Sucesso',
    userDescription: 'Apagado!',
    userResolution: 'Clique em ok para sair.',
    internalDescription: 'prompt de sucesso',
    illustration: 'paymentSuccess',
    additionalData: undefined,
  });

  // console.log('products', products);
  /* console.log('sizes', sizes)
    console.log('colors', colors)
    console.log('storeownerId', storeownerId) */

  useEffect(() => {
    //if (_.isEqual(product, oldProduct)) {
    const productObserver = productRef.onSnapshot(snap => {
      const data = snap.data();

      const payload = {
        userValue: '',
        identifierOfPicture,
        inputType: 'initial',
      };
      dispatch(payload);
      // console.log('data',data)
      if (data?.availableQuantities) {
        Object.keys(data.availableQuantities).forEach(key => {

          const [color, size] = key.split('-');

          if (size) {
            setSizes(old => (old.includes(size) ? old : [...old, size]));
            setSizesUpdate(old => (old.includes(size) ? old : [...old, size]));
          }
          if (color) {
            setColors(old => (old.includes(color) ? old : [...old, color]));
            setColorsUpdate(old => (old.includes(color) ? old : [...old, color]));
          }
        });
        // console.log('data',data)
        const payload = {
          userValue: {
            availableQuantities: data.availableQuantities,
            colors,
            sizes,
            discount: data.discount,
            price: data.price,
            description: data.description,
          },
          identifierOfPicture,
          inputType: 'fetchedItem',
        };
        dispatch(payload);

        //setTypeOfToast('alert');
        //setMessageToast('Atualizado com sucesso');
        //setOpenToast(true);
        /* const payload = {
                    userValue: data.availableQuantities,
                    identifierOfPicture,
                    inputType: 'availableQuantities',
                  }
                  dispatch(payload) */
      }

      //console.log('entrou no primeiro');
      //console.log('at end products[0][productId]', products[0][productId])

      if (products[0] && productId in products[0] && Object.prototype.hasOwnProperty.call(products[0][productId], 'requestedQuantities')) {
        const { requestedQuantities } = products[0][productId];
        if (requestedQuantities) {
          const newData = Object.assign(data, { requestedQuantities });
          //console.log('newData', newData);
          setProduct(newData);
        }
        //console.log('teste', requestedQuantities);
      } else setProduct(data);
      //setPrice(data.price);
      //setURL(data.url);

      // setProduct(data => data, { requestedQuantities })
      // setProduct(...data, products[0][productId].requestedQuantities)
      setInitialStatus(data?.status);
      setFetchingProduct(false);
      setOldProduct(product);
    });
    //}
  }, [products, cart]);
  useEffect(() => {
    async function test() {
      // console.log('productId', productId);
      const cartsWithThisProduct = await db.collectionGroup('cart').where('productIds', 'array-contains', productId).where('status', '>', 'closed').get();
      cartsWithThisProduct.docs.forEach(doc => {
        // console.log('doc', doc.data());
        setProducts(state => [doc.data().products]);
      });
    }
    test();
  }, []);
  //console.log('Object.entries(cart)',Object.entries(cart))
  //const findCartItem = useCallback(cartItemFinder(Object.entries(cart)), [cart]);
  const cartRef = useMemo(() => buyerStoreownerId && db.collection('catalog-user-data').doc(buyerStoreownerId).collection('cart'), [buyerStoreownerId]);
  const updateRequestedQuantities = useCallback(async (brandName, productId, newRequestedQuantities) => {
    if (!buyerStoreownerId) return;
    try {
      console.log('brandName', brandName);
      //const [id] = findCartItem(brandName);
      console.log(Object.entries(cart));
      if (!cartId) throw 'NO_CART_FOUND';
      await db.runTransaction(async transaction => {
        const productRef = db.collection('catalog-images').doc(productId);
        const productSnapshot = await transaction.get(productRef);
        await updateProductStock(productSnapshot, newRequestedQuantities)(transaction);
      });
      console.log('updated');

      setTypeOfToast('alert');
      setMessageToast('Enviado com sucesso');
      setOpenToast(true);
    } catch (error) {
      setTypeOfToast('warning');
      setMessageToast('Erro na atualização');
      setOpenToast(true);
      console.log({ error });
    }
  }, []);

  const excludeProduct = async () => {
    await setPromiseMessage(PromptMessage);
    const deleteFromCart = new Promise(async resolve => {
      console.log('brandName, productId', brandName, productId);
      try {
        if (!productId) throw 'NO_PRODUCT_FOUND';
        await db.runTransaction(async transaction => {
          const productRef = db.collection('catalog-images').doc(productId);
          const productSnapshot = await transaction.delete(productRef);
        });
        resolve('Ok');
      } catch (error) {
        console.log({ error });
        resolve(null);
      }
    });

    setIsDeleting(true);
    setMessage(WaitingMessage.withPromise(deleteFromCart));
    const result = await deleteFromCart;
    setMessage(result ? SuccessMessage : FailureMessage);
    setIsDeleting(false);
  };

  const availabilityInput = useMemo(
    () => (
      <FormInput
        name="availability"
        label="Disponibilidade"
        input={
          <DropDown
            list={['Disponível', 'Indisponível']}
            value={PTstatus[product.status] || ''}
            onChange={({ target: { value } }) =>
              setProduct(old => ({
                ...old,
                status: INstatus[value] || 'waitingInfo',
              }))
            }
            onChangeKeyboard={element =>
              element &&
              setProduct(old => ({
                ...old,
                status: INstatus[element.value] || 'waitingInfo',
              }))
            }
            placeholder="Está disponível em estoque?"
          />
        }
      />
    ),
    [product.status],
  );

  const priceInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="price"
          label="Preço"
          input={
            <InputText
              value={currencyFormat(product.price || '')}
              onChange={({ target: { value } }) => {
                console.log('entrou com value:', value, ' e tem o atual valor como:', product.price);
                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                setProduct(old => ({ ...old, price: maskInput(toInteger, '#######', true) }));
              }}
              placeholder="R$ 100,00"
              inputMode="numeric"
            />
          }
        />
      ),
    [product.status, product.price],
  );

  const referenceIdInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="referenceId"
          label="Referência"
          input={<InputText value={product.referenceId || ''} onChange={({ target: { value } }) => setProduct(old => ({ ...old, referenceId: value }))} placeholder="Referência da loja" />}
        />
      ),
    [product.status, product.referenceId],
  );

  const descriptionInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="description"
          label="Descrição"
          input={<InputText value={product.description || ''} onChange={({ target: { value } }) => setProduct(old => ({ ...old, description: value }))} placeholder="Descrição" />}
        />
      ),
    [product.status, product.description],
  );

  const sizesInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="sizes"
          label="Tamanhos"
          input={<InputText placeholder="P,M,G" value={(sizes && sizes.join(',')) || ''} onChange={({ target: { value } }) => setSizes(value ? value.split(',') : '')} />}
        />
      ),
    [product.status, sizes],
  );

  const colorsInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="colors"
          label="Cores"
          input={
            <InputText
              placeholder="Azul,Amarelo"
              value={(colors && colors.join(',')) || ''}
              onChange={({ target: { value } }) => {
                const newColors = value.split(',');
                setProduct(old => {
                  const newQuantities = Object.entries(old.availableQuantities || {}).reduce((prev, [key, value]) => {
                    if (newColors.some(color => key.endsWith(color))) return { ...prev, [key]: value };
                    else return prev;
                  }, {});
                  return { ...old, availableQuantities: newQuantities };
                });
                setColors(value ? newColors : '');
              }}
            />
          }
        />
      ),
    [product.status, colors],
  );
  console.log('product', product);
  const quantitiesInput = useMemo(
    () =>
      product.status === 'available' &&
      sizes.length && (
        <FormInput
          name="quantities"
          label="Quantidades"
          input={
            <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
              {sizes.map(size =>
                (colors.length ? colors : ['']).map(color => (
                  <div
                    key={`${size}-${color}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr 2fr',
                      alignItems: 'center',
                    }}
                  >
                    <label>{size}</label>
                    <label>{color}</label>
                    <InputText
                      placeholder="1"
                      value={(product.availableQuantities && product.availableQuantities[`${color}-${size}`]) || ''}
                      onChange={({ target: { value } }) =>
                        /^[0-9]*$/gm.test(value) &&
                        setProduct(old => {
                          const newQuantities = Object.assign({}, old.availableQuantities || {});
                          newQuantities[`${color}-${size}`] = value;
                          return { ...old, availableQuantities: newQuantities };
                        })
                      }
                    />
                  </div>
                )),
              )}
            </div>
          }
        />
      ),
    [product.status, sizes, colors, product.availableQuantities],
  );

  const _inputs = [availabilityInput, priceInput, referenceIdInput, descriptionInput, sizesInput, colorsInput, quantitiesInput];
  const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);

  const validations = useMemo(
    () => [
      {
        name: 'availability',
        validation: value => value !== 'waitingInfo',
        value: product.status,
        message: 'Campo obrigatório',
      },
      ...(product.status !== 'available'
        ? []
        : [
            {
              name: 'price',
              validation: ([price, totalQty]) => (totalQty > 0 ? !!price : true),
              value: [product.price, Object.values(product.availableQuantities || {}).reduce((acc, prev) => acc + parseInt(prev), 0)],
              message: 'Campo obrigatório',
            },
          ]),
    ],
    [product],
  );
  console.log('cardInfo', cardInfo);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow }}>
      <TrashButton onClick={() => excludeProduct(productId)} />
      {image}
      <ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast} messageToastRoot={messageToast} type={typeOfToast} />
      <div style={{ padding: '10px 10px 30px' }}>
        {/* <Card
                        //image={children}
                        product={product}
                        productRef={productRef}
                        setProduct={setProduct}
                        setColors={setColors}
                        setSizes={setSizes}
                        colors={colors}
                        sizes={sizes}
                        update={update}
                        updateCarts={r => setRequestedQuantities(productId, r)}
                        typeSize={typeSize}
                        setTypeSize={setTypeSize}
                        arrayOfInputs={inputsTest(
                            {
                                product,
                                setProduct,
                                sizes,
                                setSizes,
                                colors,
                                setColors,
                                update,
                                defaultQuantityValue,
                                device,
                                states,
                                dispatch,
                                identifierOfPicture,
                            },
                            //updateCart,
                        )}
                        states={states}
                        dispatch={dispatch}
                        secondArrayOfInputs={normalInputs(
                            cartProductUpdate,
                            setCartProductUpdate,
                            sizesUpdate,
                            setSizesUpdate,
                            colorsUpdate,
                            setColorsUpdate,
                            updateCart,
                            defaultQuantityValue,
                            device,
                            states,
                            dispatch,
                            identifierOfPicture,
                            updateCart,
                        ).filter(
                            input =>
                                input !== 0 &&
                                input !== false &&
                                input.props.name !== 'referenceId' &&
                                input.props.name !== 'availability' &&
                                input.props.name !== 'price' &&
                                input.props.name !== 'description',
                        )}
                        cardInfo
                        setEditing={setEditing}
                        editing={editing}
                    /> */}
        {!cardInfo ? (
          <>
            <RImg
              src={product.url}
              style={image}
              container={children =>
                initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
                  <InfoCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                ) : (
                  <SummaryCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                )
              }
              loaderContainer={() => <SpinnerWithDiv />}
            />
            {/*editing ||
              !initialStatus ||
              (initialStatus === 'waitingInfo' && (
                <>
                  <CardInputs
                    update={update || null}
                    updateCarts={r => setRequestedQuantities(productId, r)}
                    index={productId}
                    arrayOfInputs={inputsTest(product.url, product, setProduct, sizes, setSizes, colors, setColors, update)}
                    validations={validations}
                    secondArrayOfInputs={normalInputs(
                      product,
                      setProduct,
                      sizes,
                      setSizes,
                      colors,
                      setColors,
                      update,
                      defaultQuantityValue,
                      device,
                      states,
                      dispatch,
                      identifierOfPicture,
                      updateCart,
                    ).filter(
                      input =>
                        input !== 0 &&
                        input !== false &&
                        input.props.name !== 'referenceId' &&
                        input.props.name !== 'availability' &&
                        input.props.name !== 'price' &&
                        input.props.name !== 'description',
                    )}
                    product={product}
                    setEditing={setEditing}
                  />
                </>
                    ))*/}
          </>
        ) : (
          <>
            <Form buttonName="Atualizar Variações" validations={validations} sendToBackend={update} inputs={inputs} />
            {/* <Form buttonName="Atualizar" validations={validations} sendToBackend={(r) => setRequestedQuantities(productId, r)} inputs={normalInputs(
            product,
            setProduct,
            sizes,
            setSizes,
            colors,
            setColors,
            update,
            defaultQuantityValue,
            device,
            states,
            dispatch,
            identifierOfPicture,
            updateCart,
          ).filter(
            input =>
              input !== 0 &&
              input !== false &&
              input.props.name !== 'referenceId' &&
              input.props.name !== 'availability' &&
              input.props.name !== 'price' &&
              input.props.name !== 'description',
          )} /> */}

            {/* ((!cartProduct.status && product.status === 'available') || editing) && (
              <EditCardCatalog product={{ ...cartProduct, ...productCart }} update={r => setRequestedQuantities(productId, r)} setEditing={setEditing} />
            ) */}
          </>
        )}
      </div>
    </div>
  );
};

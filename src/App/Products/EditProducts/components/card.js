/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import RImg from 'react-image';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { image } from '../styles';
import { db, fs } from '../../../../Firebase';
import EditCard from './editCard';
import SummaryCard from './summaryCard';
import InfoCard from './infoCard';

export default ({ cartProduct, index, brandName, productId, productData, setPromiseMessage, setMessage }) => {
  //console.log('productId',productId)
  //console.log('state,cartProduct,index,brandName,productId, setURL, setPrice',state,cartProduct,index,brandName,productId, setURL, setPrice)
  const [productRef] = useState(db.collection('catalog-images').doc(productId));
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [editing, setEditing] = useState(false);
  const [product, setProduct] = useState(productData);
  const [productCart, setProductCart] = useState(productData);
  const [initialStatus, setInitialStatus] = useState(productData.status);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  useEffect(() => {
    if (productData.availableQuantities) {
      Object.keys(productData.availableQuantities).forEach(key => {
        const [size, color] = key.split('-');
        if (size) setSizes(old => (old.includes(size) ? old : [...old, size]));
        if (color) setColors(old => (old.includes(color) ? old : [...old, color]));
      });
    }
    //setFetchingProduct(false);
  }, [productData]);
  /* useEffect(
        () =>
            productRef.onSnapshot(snap => {
                const data = snap.data();
                if (data.availableQuantities) {
                    Object.keys(data.availableQuantities).forEach(key => {
                        const [size, color] = key.split('-');
                        if (size) setSizes(old => (old.includes(size) ? old : [...old, size]));
                        if (color) setColors(old => (old.includes(color) ? old : [...old, color]));
                    });
                }
                setPrice(data.price);
                setURL(data.url);
                setProduct(data);
                setProductCart(data)
                setInitialStatus(data.status);
                setFetchingProduct(false);
            }),
        [],
    ); */

  const update = useCallback(async () => {
    try {
      const cartsWithThisProduct = await db.collectionGroup('cart').where('productIds', 'array-contains', productId).where('status', '>', 'closed').get();
      await db.runTransaction(async transaction => {
        // console.log('product inside UserCartItem: ', product)
        if (product.status === 'available' && !Object.keys(product.availableQuantities || {}).length) transaction.update(productRef, { ...product, status: 'waitingStock' });
        else if (product.status === 'available' && Object.values(product.availableQuantities || {}).reduce((acc, cur) => acc + parseInt(cur), 0) === 0)
          transaction.update(productRef, { ...product, status: 'soldOut' });
        else if (product.status === 'waitingInfo' || product.status === 'unavailable')
          transaction.update(productRef, {
            status: product.status,
            price: fs.FieldValue.delete(),
            referenceId: fs.FieldValue.delete(),
            description: fs.FieldValue.delete(),
            availableQuantities: fs.FieldValue.delete(),
          });
        else transaction.update(productRef, product);

        cartsWithThisProduct.docs.forEach(doc =>
          transaction.set(
            doc.ref,
            {
              products: {
                [productId]: {
                  requestedQuantities: fs.FieldValue.delete(),
                  status: fs.FieldValue.delete(),
                },
              },
              status: 'open',
              total: fs.FieldValue.delete(),
              lastUpdate: fs.FieldValue.serverTimestamp(),
              updatedBy: 'seller',
            },
            { merge: true },
          ),
        );
      });
      setEditing(false);
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }, [productRef, product]);

  if (fetchingProduct) return <SpinnerWithDiv />;

  return (
    <RImg
      src={product.url}
      style={image}
      container={children =>
        !initialStatus || initialStatus === 'waitingInfo' || editing ? (
          <EditCard
            productId={productId}
            productCart={productCart}
            image={children}
            product={product}
            productRef={productRef}
            setProduct={setProduct}
            setColors={setColors}
            setSizes={setSizes}
            colors={colors}
            sizes={sizes}
            update={update}
            cartProduct={cartProduct}
            index={index}
            brandName={brandName}
            setPromiseMessage={setPromiseMessage} setMessage={setMessage}
            //setURL={setURL} setPrice={setPrice}
            initialStatus={initialStatus}
            setInitialStatus={setInitialStatus}
          />
        ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
          <InfoCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children} setEditing={setEditing} />
        ) : (
          <SummaryCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children} setEditing={setEditing} />
        )
      }
      loaderContainer={() => <SpinnerWithDiv />}
    />
  );
};

import React, { useCallback, useMemo, useState, useContext } from 'react';
import { useLocation, useRoute } from 'wouter';

import Button from '@bit/vitorbarbosa19.ziro.button';
// import CardForm from '@bit/vitorbarbosa19.ziro.card-form';
import JSZip from 'jszip';
import { containerWithPadding } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import axios from 'axios';
import { Virtuoso } from 'react-virtuoso';
import AutoSizer from 'react-virtualized-auto-sizer';
import Card from './components/card';
import { priceTotal, saleSummary, summary, total } from './styles_catalog';
import { useProducts } from './hooks/useProducts';
import { db, fs } from '../../../Firebase';
import { brandCart, brandName, buttonDownload } from './styles';
import { userContext } from '../../appContext';
import { titleCase } from '../utils/titleCase';

export default () => {
  //console.log('get in cart',cart)
  //console.log('state in cart',state)
  const { fantasy } = useContext(userContext);
  const fantasyFormatted = titleCase(fantasy);
  //console.log('fantasyFormatted', fantasyFormatted);
  const [prices, setPrices] = useState({});
  const [urls, setURLs] = useState({});
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/produtos/editar');
  const { productsData } = useProducts(fantasyFormatted);
  const totalItems = useMemo(() => {
    console.log(productsData);
    return productsData.length;
  }, [productsData]);

  //console.log(productsData);
  //const { cartId } = params;
  //console.log('cartId',cartId)
  //const [totalItems, totalPrice] = useMemo(() => (productIds && products ? productIds.reduce(reduceTotal(prices, products), [0, 0]) : [0, 0]), [productIds, products, prices]);
  /* const confirmCartItem = useCallback(async () => {
    console.log('cart', cart);
    console.log('totalPrice', totalPrice);
    try {
      await db
        .collection('catalog-user-data')
        .doc(cart.buyerStoreownerId)
        .collection('cart')
        .doc(cart.id)
        .set(
          {
            status: 'waitingPayment',
            lastUpdate: fs.FieldValue.serverTimestamp(),
            updatedBy: 'seller',
            total: `${totalPrice}`,
          },
          { merge: true },
        );
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }, [cart, totalPrice]); */

  /* const downloadAllImages = useCallback(async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder(`${storeowner.razao}`);
      await Promise.all(
        Object.entries(urls).map(([productId, url]:any) => {
          return axios.get(url, { responseType: 'arraybuffer' }).then(({ data }) => {
            const filename = `peca_${productIds.indexOf(productId) - 1}.png`;
            const file = new Blob([Buffer.from(data, 'binary')]);
            folder.file(filename, file);
          });
        }),
      );
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${storeowner.razao}.zip`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log({ error });
    }
  }, [productIds, urls]); */

  /* const handleClickUploadProduct = () => {
    localStorage.setItem('voltar', `/pedidos/${cartId}`);
    localStorage.setItem('cart', JSON.stringify(cart));
    setLocation(`produtos/${cartId}`);
    console.log('Teste');
  }; */
  return (
    <div style={containerWithPadding}>
      <Button click={() => setLocation('/produtos/adicionar')} cta="Adicionar novos produtos" type="button" />
      <div style={summary}>
        <div style={saleSummary}>
          <label style={total}>Quantidade</label>
          <div style={{ textAlign: 'end' }}>
            <label style={priceTotal}>{totalItems}</label>
          </div>
        </div>
        {/* cart.status === 'waitingConfirmation' || cart.status === 'open' && <Button type="button" cta="Upload de Produto" click={handleClickUploadProduct} submitting={false} /> */}
      </div>
      <div style={brandCart}>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 auto', height: '100vh' }}>
            {/* <Button type="button" cta="Fazer download fotos" click={downloadAllImages} style={buttonDownload} /> */}

            <AutoSizer defaultHeight={1200} defaultWidth={800}>
              {({ width, height }) => {
                return (
                  <Virtuoso
                    style={{ height, width }}
                    data={productsData}
                    overscan={100}
                    itemContent={(index, data) => {
                      const { productId } = data;
                      return (
                        <Card
                          key={productId}
                          productData={data}
                          productId={productId}
                          cartProduct={productId}
                          //setPrice={price => setPrices(old => ({ ...old, [productId]: price }))}
                          //setURL={url => setURLs(old => ({ ...old, [productId]: url }))}
                          brandName={fantasyFormatted}
                          index={index}
                        />
                      );
                    }}
                  />
                );
              }}
            </AutoSizer>
          </div>
        </div>
        {/* productsData.map((data, index) => {
          const { productId } = data;
          return (
            <Card
              key={productId}
              productId={productId}
              cartProduct={productId}
              setPrice={price => setPrices(old => ({ ...old, [productId]: price }))}
              setURL={url => setURLs(old => ({ ...old, [productId]: url }))}
              brandName={fantasyFormatted}
              index={index}
            />
          );
        }) */}
      </div>
    </div>
  );
};

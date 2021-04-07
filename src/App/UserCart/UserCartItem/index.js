import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useRoute } from 'wouter';

import Button from '@bit/vitorbarbosa19.ziro.button';
// import CardForm from '@bit/vitorbarbosa19.ziro.card-form';
import Header from '@bit/vitorbarbosa19.ziro.header';
import JSZip from 'jszip';
import { containerWithPadding } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import { get } from 'axios';
import Card from './card';
import { priceTotal, saleSummary, summary, total } from './styles_catalog';
import { db, fs } from '../../../Firebase';
import { brandCart, brandName, buttonDownload } from './styles';
import { reduceTotal } from './utils';

export default ({ state, cart: { productIds, products, ...cart }, storeowner, oldQuery }) => {
  //console.log('get in cart',cart)
  //console.log('state in cart',state)
  const [prices, setPrices] = useState({});
  const [urls, setURLs] = useState({});
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/pedidos/:cartId?');
  const { cartId } = params;
  //console.log('cartId',cartId)
  const [totalItems, totalPrice] = useMemo(() => (productIds && products ? productIds.reduce(reduceTotal(prices, products), [0, 0]) : [0, 0]), [productIds, products, prices]);
  const confirmCartItem = useCallback(async () => {
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
  }, [cart, totalPrice]);

  const downloadAllImages = useCallback(async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder(`${storeowner.razao}`);
      await Promise.all(
        Object.entries(urls).map(([productId, url]) => {
          return get(url, { responseType: 'arraybuffer' }).then(({ data }) => {
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
  }, [productIds, urls]);

  const handleClickUploadProduct = () => {
    localStorage.setItem('voltar', `/pedidos/${cartId}`);
    localStorage.setItem('cart', JSON.stringify(cart));
    setLocation(`produtos/adicionar/${cartId}`);
    console.log('Teste');
  };
  return (
    <div style={containerWithPadding}>
      <Header type="icon-link" title={storeowner.razao} navigateTo={`/pedidos${oldQuery || ''}`} icon="back" />
      <div style={brandCart}>
        <label style={brandName}>{cart.brandName}</label>
        <Button type="button" cta="Fazer download fotos" click={downloadAllImages} style={buttonDownload} />
        {productIds.map((productId, index) => (
          /* <CardForm
                                            key={productId}
                                            productId={productId}
                                            cartProduct={products[productId]}
                                            setPrice={(price) =>
                                                setPrices((old) => ({ ...old, [productId]: price }))
                                            }
                                            setURL={(url) =>
                                                setURLs((old) => ({ ...old, [productId]: url }))
                                            }
                                        /> */
          <Card
            key={productId}
            productId={productId}
            cartProduct={products[productId]}
            setPrice={price => setPrices(old => ({ ...old, [productId]: price }))}
            setURL={url => setURLs(old => ({ ...old, [productId]: url }))}
            brandName={cart.brandName}
            exclude={() => excludeProduct(productId)}
            state={state}
            index={index}
            buyerStoreownerId={cart.buyerStoreownerId}
          />
        ))}
        <div style={summary}>
          <div style={saleSummary}>
            <label style={total}>Total da compra</label>
            <label style={priceTotal}>{currencyFormat(totalPrice)}</label>
          </div>
          <div style={saleSummary}>
            <label style={total}>Quantidade</label>
            <label style={priceTotal}>{totalItems}</label>
          </div>
          {cart.status === 'waitingConfirmation' || cart.status === 'open' && <Button type="button" cta="Upload de Produto" click={handleClickUploadProduct} submitting={false} />}
        </div>
        {cart.status === 'waitingConfirmation' && <Button type="button" cta="Confirmar pedido" click={confirmCartItem} submitting={false} />}
        {cart.status === 'waitingPayment' && <Button type="button" cta="Aguardando pagamento" click={() => {}} submitting />}
      </div>
    </div>
  );
};

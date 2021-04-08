import React, { useCallback, useMemo, useState, useContext } from 'react';
import { useLocation, useRoute } from 'wouter';

import Button from '@bit/vitorbarbosa19.ziro.button';
// import CardForm from '@bit/vitorbarbosa19.ziro.card-form';
import JSZip from 'jszip';
import { containerWithPadding, fontTitle, fontSizeSmall } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import axios from 'axios';
import { Virtuoso } from 'react-virtuoso';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useMessage, useMessagePromise } from '@bit/vitorbarbosa19.ziro.message-modal';
import { ZiroPromptMessage, ZiroWaitingMessage } from 'ziro-messages';
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
  const setPromiseMessage = useMessagePromise();
  const setMessage = useMessage();
  const totalItems = useMemo(() => {
    console.log(productsData);
    return productsData.length;
  }, [productsData]);

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
                    useWindowScroll
                    style={{ height, width }}
                    data={productsData}
                    overscan={300}
                    components={{
                      Footer: () => {
                        return (
                          <div
                            style={{
                              padding: '1rem',
                              textAlign: 'center',
                              marginTop: '100px',
                              fontFamily: fontTitle,
                              fontSize: fontSizeSmall,
                              textTransform: 'uppercase',
                            }}
                          >
                            acabou
                          </div>
                        );
                      },
                    }}
                    itemContent={(index, data) => {
                      const { productId } = data;
                      return (
                        <div style={{ marginTop: '2rem' }}>
                          <Card
                            key={productId}
                            productData={data}
                            productId={productId}
                            cartProduct={productId}
                            setPromiseMessage={setPromiseMessage}
                            setMessage={setMessage}
                            //setPrice={price => setPrices(old => ({ ...old, [productId]: price }))}
                            //setURL={url => setURLs(old => ({ ...old, [productId]: url }))}
                            brandName={fantasyFormatted}
                            index={index}
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

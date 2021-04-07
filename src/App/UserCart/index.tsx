import React, { useState, useEffect, useContext } from 'react';
import { toCartArray, toStoreownerData } from './utils';
import SearchCart from './SearchCart';
import CartItem from './UserCartItem';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';

import {userContext} from '../appContext'
import Empty from './Empty'
import fetch from './fetch';
import {useCart} from './cart'

export default ({ cartId }) => {
    const {fantasy} = useContext(userContext)
    console.log('fantasy:',fantasy)
  const [queryStr, setQueryStr] = useState();
  const [allCarts, setAllCarts] = useState([]);
  const [allStoreowners, setAllStoreowners] = useState([]);
  const [newDateForFilter, setNewDate] = useState(new Date());
  const [storeowners, setStoreowners] = useState([]);
  const [carts, setCarts] = useState([]);
  const [last7Days, setLast7Days] = useState(null);
  const [selectedCart, setSelectedCard] = useState(null);
  const [selectedStoreowner, setSelectedStoreowner] = useState(null);
  const cartString = localStorage.getItem('cart');
  const cartObject = JSON.parse(cartString);
  //const { cartIds, onCartPress } = useCart(cartId, cartObject);
  const state = { newDateForFilter, storeowners, carts, last7Days, selectedCart, selectedStoreowner, setStoreowners, setCarts, setAllCarts, setAllStoreowners };

  useEffect(() => {
    setNewDate(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`));
    setLast7Days(new Date(new Date(newDateForFilter).setDate(newDateForFilter.getDate() - 7)));
  }, []);
  useEffect(() => {
    if (newDateForFilter && last7Days) {
      fetch(state);
    }
  }, [newDateForFilter, last7Days]);
  useEffect(() => {
    if (allCarts.length > 0 && allStoreowners.length > 0) {
        console.log('fantasy',fantasy)

      console.log('allCarts.reduce(toCartArray, [])',allCarts.reduce(toCartArray, []).filter(item => 'QBONITA VESTIDOS DE FESTA EIRELI'.includes(item.brandName.toUpperCase())))
      console.log('allCarts.reduce(toCartArray, [])',allCarts.reduce(toCartArray, []).filter(item => fantasy.includes(item.brandName.toUpperCase())))
      setCarts(allCarts.reduce(toCartArray, []).filter(item => fantasy.includes(item.brandName.toUpperCase())));
      setStoreowners(allStoreowners.reduce(toStoreownerData, []));
    }
  }, [allCarts, allStoreowners]);
  useEffect(() => {
    if (cartId && carts.length > 0) {
      setSelectedCard(cartId ? carts.find(({ id }) => id === cartId) : undefined);
      setSelectedStoreowner(selectedCart ? storeowners[selectedCart.buyerStoreownerId] : undefined);
    }
  }, [cartId, carts, storeowners, selectedCart]);
  if (cartId && selectedCart && selectedStoreowner) return <CartItem state={state} cart={selectedCart} storeowner={selectedStoreowner} oldQuery={queryStr} />;
  else if (carts.length > 0) return <SearchCart carts={carts} storeowners={storeowners} setQueryStr={setQueryStr} />;
  else if(storeowners.length === 0) return <SpinnerWithDiv />;
  else return <Empty />
};

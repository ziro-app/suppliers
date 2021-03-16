import React, { useState, useEffect } from 'react';
import { toCartArray, toStoreownerData } from './utils';
import SearchCart from './SearchCart';
import CartItem from './UserCartItem';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';

import fetch from './fetch';

export default ({ cartId }) => {
  const [queryStr, setQueryStr] = useState();
  const [allCarts, setAllCarts] = useState([]);
  const [allStoreowners, setAllStoreowners] = useState([]);
  const [newDateForFilter, setNewDate] = useState(new Date());
  const [storeowners, setStoreowners] = useState([]);
  const [carts, setCarts] = useState([]);
  const [last7Days, setLast7Days] = useState(null);
  const [selectedCart, setSelectedCard] = useState(null);
  const [selectedStoreowner, setSelectedStoreowner] = useState(null);
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
      setCarts(allCarts.reduce(toCartArray, []));
      setStoreowners(allStoreowners.reduce(toStoreownerData, []));
    }
  }, [allCarts, allStoreowners]);
  useEffect(() => {
    if (cartId && carts.length > 0) {
      setSelectedCard(cartId ? carts.find(({ id }) => id === cartId) : undefined);
      setSelectedStoreowner(selectedCart ? storeowners[selectedCart.buyerStoreownerId] : undefined);
    }
  }, [cartId, carts, storeowners, selectedCart]);
  if (cartId && selectedCart && selectedStoreowner) return <CartItem cart={selectedCart} storeowner={selectedStoreowner} oldQuery={queryStr} />;
  else if (carts.length > 0) return <SearchCart carts={carts} storeowners={storeowners} setQueryStr={setQueryStr} />;
  else return <SpinnerWithDiv />;
};

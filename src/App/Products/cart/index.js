import { useCallback, useMemo, useState } from 'react';
import { useGlobalCache, useMessageModal } from '@bit/vitorbarbosa19.ziro.flow-manager';
// import { useUserData } from '../useInfo';
import { db, fs } from '../../../Firebase';
import { cartItemProductAdder, cartItemProductSubtracter, updateProductStock } from './transactions';
import { cartItemFinder, statusReducer, idReducer } from './utils';
// import { useToast } from '../../useUI';

const PENDING_CART = Symbol('PENDING_CART');
const PENDING_REMOVED = Symbol('PENDING_REMOVED');
const { serverTimestamp } = fs.FieldValue;

export const useCart = (idCart,cartObject) => {
    const [cart,setCart] = useState(cartObject)
    if(!idCart) return {cartIds:[],onCartPress: () => null };
    console.log('idCart',idCart)
    const queryCart = db.collection('catalog-user-data')
    .doc(cart.buyerStoreownerId)
    .collection('cart')
    .doc(cart.id)
  queryCart.onSnapshot(async snapshot => {
    const carts = [];
    console.log('snapshot',snapshot.data())
    if (!snapshot.empty) {
      snapshot => {
        setCart(item => [...item,snapshot.data()]);
      }

    }
  });
  console.log('cart',cart)
 // const [{ cart, buyerStoreownerId, uid }] = useUserData();
  // const { setMessageToast, setOpenToast } = useToast();
  // const [pendingCart, setPendingCart] = useGlobalCache([], PENDING_CART);
  // const [pendingRemoved, setPendingRemoved] = useGlobalCache([], PENDING_REMOVED);

  const cartRef = useMemo(() => cart.buyerStoreownerId && db.collection('catalog-user-data').doc(cart.buyerStoreownerId).collection('cart').doc(cart.id), []);
  console.log('cartRef.id',cartRef.id)
  const cartIds = useMemo(() => Object.values(cart).reduce(idReducer, []), [cart]);
  const cartByStatus = useMemo(() => {
    const { paid, ...restOfCarts } = Object.entries(cart).reduce(statusReducer, {});
    return restOfCarts;
  }, [cart]);

  /* const [messageAction, setMessageAction] = useState();
  const [_, setMessage] = useMessageModal({
    REMOVE_PRODUCT: {
      title: 'Remover do carrinho',
      message: 'Sua seleção de grade para o produto será perdida, deseja continuar?',
      firstButtonTitle: 'sim',
      firstButtonAction: messageAction,
      secondButtonTitle: 'não',
    },
  }); */

  const usableCartIds = useMemo(() => {
    return [...cartIds]
  }, [cartIds]);

  const findCartItem = useCallback(cartItemFinder(Object.entries(cart)), [cart]);
  const addProductToCartItem = useCallback(cartItemProductAdder(cart.buyerStoreownerId), [cart]);
  const deleteProductFromCartItem = useCallback(cartItemProductSubtracter(cart.buyerStoreownerId), [cart]);

  /* const getValidCartItemRef = useCallback(
    async brandName => {
      const [id] = findCartItem(brandName);
      console.log('id',id)
      return id ? cartRef.doc(id) : cartRef.add({ brandName, added: serverTimestamp(), status: 'open', lastUpdate: serverTimestamp() });
    },
    [cartRef, findCartItem],
  ); */

  const addToCart = useCallback(
    async (brandName, productId) => {
      if (!cart.buyerStoreownerId) return;
      try {
        // setPendingCart(old => [...old, productId]);
        await db.runTransaction(async transaction => {
          const productRef = db.collection('catalog-images').doc(productId);
          await addProductToCartItem(productRef, cartRef)(transaction);
        });
      } catch (error) {
        console.log({ error });
      } finally {
        // setTimeout(() => setPendingCart(old => old.filter(pId => pId !== productId)), 500);
      }
    },
    [cart, addProductToCartItem],
  );

  const addBatchToCart = useCallback(
    async (brandName, productIds) => {
      if (!cart.buyerStoreownerId) return;
      try {
        // setPendingCart(old => [...old, ...productIds]);
        await db.runTransaction(async transaction => {

          await Promise.all(
            productIds.map(async productId => {
              const productRef = db.collection('catalog-images').doc(productId);
              await addProductToCartItem(productRef, cartRef)(transaction);
            }),
          );
        });
      } catch (error) {
        console.log({ error });
      } finally {
        // setTimeout(() => setPendingCart(old => old.filter(pId => !productIds.includes(pId))), 500);
      }
    },
    [cart, addProductToCartItem],
  );

  const deleteFromCart = useCallback(
    async (brandName, productId) => {
      if (!cart.buyerStoreownerId) return;
      try {
        // setPendingRemoved(old => [...old, productId]);
        const [id] = findCartItem(brandName);
        if (!id) throw 'NO_CART_FOUND';
        await db.runTransaction(async transaction => {
          const cartItemRef = cartRef.doc(id);
          const cartItemSnapshot = await transaction.get(cartItemRef);
          const productRef = db.collection('catalog-images').doc(productId);
          const productSnapshot = await transaction.get(productRef);
          await deleteProductFromCartItem(productSnapshot, cartItemSnapshot)(transaction);
          if (cartItemSnapshot.data().productIds.length === 1) transaction.delete(cartItemRef);
        });
      } catch (error) {
        console.log({ error });
      } finally {
        // setTimeout(() => setPendingRemoved(old => old.filter(pId => pId !== productId)), 500);
      }
    },
    [cart, findCartItem, deleteProductFromCartItem, cartRef],
  );

  const deleteBatchFromCart = useCallback(
    async (brandName, productIds) => {
      if (!cart.buyerStoreownerId) return;
      try {
        // setPendingRemoved(old => [...old, ...productIds]);
        const [id] = findCartItem(brandName);
        if (!id) throw 'NO_CART_FOUND';
        await db.runTransaction(async transaction => {
          const cartItemRef = cartRef.doc(id);
          const cartItemSnapshot = await transaction.get(cartItemRef);
          await Promise.all(
            productIds.map(async productId => {
              const productRef = db.collection('catalog-images').doc(productId);
              const productSnapshot = await transaction.get(productRef);
              await deleteProductFromCartItem(productSnapshot, cartItemSnapshot)(transaction);
            }),
          );
          if (cartItemSnapshot.data().productIds.length === productIds.length) transaction.delete(cartItemRef);
        });
      } catch (error) {
        console.log({ error });
      } finally {
        // setTimeout(() => setPendingRemoved(old => old.filter(pId => !productIds.includes(pId))), 500);
      }
    },
    [cart, findCartItem, deleteProductFromCartItem, cartRef],
  );

  const updateRequestedQuantities = useCallback(
    async (brandName, productId, newRequestedQuantities) => {
      if (!cart.buyerStoreownerId) return;
      try {
        const [id] = findCartItem(brandName);
        if (!id) throw 'NO_CART_FOUND';
        await db.runTransaction(async transaction => {
          const cartItemRef = cartRef.doc(id);
          const cartItemSnapshot = await transaction.get(cartItemRef);
          const productRef = db.collection('catalog-images').doc(productId);
          const productSnapshot = await transaction.get(productRef);
          await updateProductStock(productSnapshot, cartItemSnapshot, newRequestedQuantities)(transaction);
        });
        console.log('updated');
      } catch (error) {
        console.log({ error });
      }
    },
    [cart, findCartItem, cartRef],
  );

  const onCartPress = useCallback(
    (productId, brandName, status) => {
      if (!idCart) {
        // setMessageToast('Cadastre-se para salvar peças e ver preços');
        // setOpenToast(true);
        return;
      }
      if (cartIds.includes(productId)) {
        //setMessageAction(() => () => deleteFromCart(brandName, productId));
        //setMessage('REMOVE_PRODUCT');
      } else {
        if (status === 'soldOut' || status === 'unavailbale') {
          // setMessageToast('Este item está esgotado');
          // setOpenToast(true);
          return;
        }
        console.log('adding to:',brandName,' productId:',productId)
        addToCart(brandName, productId);
      }
    },
    [cartIds],
  );

  return {
    cart,
    cartByStatus,
    addToCart,
    deleteFromCart,
    addBatchToCart,
    deleteBatchFromCart,
    updateRequestedQuantities,
    onCartPress,
    cartIds: usableCartIds,
  };
};

const findCart = (cart, id) => (Object.entries(cart || {}).find(([_cartId, { paymentId }]) => paymentId === id) || [null])[0];

/* export const useCartIDfromPaymentID = id => {
  const [{ cart }] = useUserData();
  const cartId = useMemo(() => findCart(cart, id), [cart, id]);
  return cartId;
}; */

const prepareDataToPay = (state, sellerZoopId, charge, seller) => {
    console.log(state, sellerZoopId, charge, seller);
    console.log('state', state);
    console.log('sellerZoopId', sellerZoopId);
    console.log('charge', charge);
    console.log('seller', seller);
    const { cardholder, expiry, prettyNumber, cvv } = state;
    console.log('cardholder', cardholder);
    console.log('expiry', expiry);
    console.log('prettyNumber', prettyNumber);
    console.log('cvv', cvv);
    const cardholderFormatted = cardholder.trim().toLowerCase();
    const month = expiry.substring(0, 2);
    const year = `20${expiry.substring(3, 5)}`;
    return { sellerZoopId, charge, cardholder: cardholderFormatted, month, year, prettyNumber, cvv, installments: 1, seller };
};

export default prepareDataToPay;

import currencyFormat from '@ziro/currency-format';

const linkMessage = (baseUrl, docId, seller, charge, installmentsMax) => {
  const formattedCharge = currencyFormat(charge);

  const message = `Você recebeu uma cobrança de ${seller} no valor de ${formattedCharge} com parcelamento em até ${installmentsMax}x.
Acesse o link abaixo para pagar:`;

  const link = `${message}\n${baseUrl}${docId}/escolher-cartao?doc`;

  return link;
};

export default linkMessage;

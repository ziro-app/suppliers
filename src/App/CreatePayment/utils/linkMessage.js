const linkMessage = (baseUrl, docId, seller, charge, installmentsMax, checkoutWithoutRegister) => {
  const link = checkoutWithoutRegister ? `${baseUrl}${docId}/finalizar-sem-cadastro` : `${baseUrl}${docId}/escolher-cartao?doc`;
  let message = ``;

  if (seller && charge && installmentsMax) {
    message = `Você recebeu uma cobrança de ${seller} no valor de ${charge} com parcelamento em até ${installmentsMax}x.\nAcesse o link abaixo para pagar:\n${link}`;
  } else if (seller && charge) {
    message = `Você recebeu uma cobrança de ${seller} no valor de ${charge}.\nAcesse o link abaixo para pagar:\n${link}`;
  } else if (charge && installmentsMax) {
    message = `Você recebeu uma cobrança no valor de ${charge} com parcelamento em até ${installmentsMax}x.\nAcesse o link abaixo para pagar:\n${link}`;
  } else if (seller) {
    message = `Você recebeu uma cobrança de ${seller}.\nAcesse o link abaixo para pagar:\n${link}`;
  } else if (charge) {
    message = `Você recebeu uma cobrança no valor de ${charge}.\nAcesse o link abaixo para pagar:\n${link}`;
  } else {
    message = `Você recebeu uma cobrança.\nAcesse o link abaixo para pagar:\n${link}`;
  }

  return message;
};

export default linkMessage;

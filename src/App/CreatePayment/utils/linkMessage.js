const linkMessage = (baseUrl, docId, seller, charge, installmentsMax) => {
    const link = `${baseUrl}${docId}`;
    let message = ``;

    if (seller && charge && installmentsMax) {
        message = `Pague suas compras na *${seller}* no valor de *${charge}* em até *${installmentsMax}x s/ juros*. Só clicar 😎\n${link}`;
    } else if (seller && charge) {
        message = `Pague suas compras na *${seller}* no valor de *${charge}*. Só clicar 😎\n${link}`;
    } else if (charge && installmentsMax) {
        message = `Pague sua compra no valor de *${charge}* em até *${installmentsMax}x s/ juros*. Só clicar 😎\n${link}`;
    } else if (seller || seller && installmentsMax) {
        message = `Pague sua compra na *${seller}*. Só clicar 😎\n${link}`;
    } else if (charge) {
        message = `Pague sua compra no valor de *${charge}*. Só clicar 😎\n${link}`;
    } else {
        message = `Pague sua compra. Só clicar 😎\n${link}`;
    }

    return message;
};

export default linkMessage;

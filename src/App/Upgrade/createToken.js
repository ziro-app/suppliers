import { post } from 'axios';

const createToken = async (cnpj, bankNumber, reason, agency, accountNumber, accountType, zoopId) => {
  
  const update = async () => {
    const responseToken = await post(
      `${process.env.PAY_URL}token-bank-create`,
      {
        ein: cnpj,
        bank_code: bankNumber,
        holder_name: reason,
        routing_number: agency,
        account_number: accountNumber,
        type: accountType
      },
      {
        headers: {
          Authorization: `${process.env.PAY_TOKEN}`,
        },
      }
    );
    // Associando token ao vendedor
    await post(
      `${process.env.PAY_URL}bank-associate`,
      {
        customer: zoopId,
        token: responseToken.data.id
      }, 
      {
        headers: {
          Authorization: `${process.env.PAY_TOKEN}`,
        },
      }
    );
  };

  await update();
};

export default createToken;
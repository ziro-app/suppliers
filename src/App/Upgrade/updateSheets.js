import axios from 'axios';

const updateSheets = async (userPos, cpf, nascimento, categoria, tipoConta, codBanco, titular, agencia, numConta) => {
  
  const update = async () => {
    const url = process.env.SHEET_URL;
    const config = {
      url,
      method: 'POST',
      headers: {
        'Authorization': process.env.SHEET_TOKEN,
        'Content-Type': 'application/json'
      }
    };
    
    await axios({
      ...config, data: {
        'apiResource': 'values',
        'apiMethod': 'batchUpdate',
        'spreadsheetId': process.env.SHEET_SUPPLIERS_ID,
        'resource': {
          'data': [
            {
              'range': `Base!N${userPos}:U${userPos}`,
              'values': [[
                `${cpf}`,
                `${nascimento}`,
                `${categoria}`,
                `${tipoConta}`,
                codBanco.startsWith('0') ? `'${codBanco}` : codBanco,
                `${titular}`,
                agencia.startsWith('0') ? `'${agencia}` : agencia,
                numConta.startsWith('0') ? `'${numConta}` : numConta,
              ]]
            },
          ]
        },
        'valueInputOption': 'user_entered'
      }
    });
  };

  await update();
};

export default updateSheets;
import { post } from 'axios';

const updateSellerZoop = async (zoopId, cpf, dayOfBirth, phone, category, statementDescriptor) => {

    const update = async () => {
        await post(
            `${process.env.PAY_URL}sellers-update?seller_id=${zoopId}`,
            {
                owner: {
                    taxpayer_id: cpf,
                    birthdate: dayOfBirth.split('/').reverse().join('-'),
                    phone_number: phone
                },
                mcc: category,
                statementDescriptor
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

export default updateSellerZoop;

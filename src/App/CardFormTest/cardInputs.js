import React, { useMemo } from 'react';
import Form from '@bit/vitorbarbosa19.ziro.form';
import { card } from './styles';

export default ({ update, image, arrayOfInputs, validations, isSubmitting, secondArrayOfInputs }) => {
    const _inputs = arrayOfInputs;
    //console.log(update);
    const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow, borderRadius: '5px' }}>
            {image && image}
            <div style={{ padding: '10px 10px 20px' }}>
                <Form
                    validations={[]}
                    sendToBackend={update || null}
                    inputs={inputs}
                    buttonName={secondArrayOfInputs ? 'Enviar produtos para estoque' : ''}
                    withoutBottomLabelOnSubmit
                />
            </div>
            {secondArrayOfInputs && (
                <div style={{ padding: '10px 10px 20px' }}>
                    <Form
                        validations={[]}
                        sendToBackend={update || null}
                        inputs={secondArrayOfInputs}
                        buttonName="Atualizar pedido"
                        withoutBottomLabelOnSubmit
                    />
                </div>
            )}
        </div>
    );
}

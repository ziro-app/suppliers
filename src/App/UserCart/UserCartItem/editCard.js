/* eslint-disable no-useless-escape */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-else-return */
import React, { useMemo } from 'react';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import DropDown from '@bit/vitorbarbosa19.ziro.dropdown';
import { card } from './styles';

const PTstatus = {
    available: 'Disponível',
    unavailable: 'Indisponível',
    closed: 'Disponível',
    waitingInfo: '',
    soldOut: 'Indisponível',
};

const INstatus = {
    Disponível: 'available',
    Indisponível: 'soldOut',
};

export default ({ image, product, setProduct, sizes, setSizes, colors, setColors, update }) => {
    const availabilityInput = useMemo(
        () => (
            <FormInput
                name="availability"
                label="Disponibilidade"
                input={
                    <DropDown
                        list={['Disponível', 'Indisponível']}
                        value={PTstatus[product.status] || ''}
                        onChange={({ target: { value } }) =>
                            setProduct(old => ({
                                ...old,
                                status: INstatus[value] || 'waitingInfo',
                            }))
                        }
                        onChangeKeyboard={element =>
                            element &&
                            setProduct(old => ({
                                ...old,
                                status: INstatus[element.value] || 'waitingInfo',
                            }))
                        }
                        placeholder="Está disponível em estoque?"
                    />
                }
            />
        ),
        [product.status],
    );

    const priceInput = useMemo(
        () =>
            product.status === 'available' && (
                <FormInput
                    name="price"
                    label="Preço"
                    input={
                        <InputText
                            value={currencyFormat(product.price || '')}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                                setProduct(old => ({ ...old, price: maskInput(toInteger, '#######', true) }));
                            }}
                            placeholder="R$ 100,00"
                            inputMode="numeric"
                        />
                    }
                />
            ),
        [product.status, product.price],
    );

    const referenceIdInput = useMemo(
        () =>
            product.status === 'available' && (
                <FormInput
                    name="referenceId"
                    label="Referência"
                    input={
                        <InputText
                            value={product.referenceId || ''}
                            onChange={({ target: { value } }) => setProduct(old => ({ ...old, referenceId: value }))}
                            placeholder="Referência da loja"
                        />
                    }
                />
            ),
        [product.status, product.referenceId],
    );

    const descriptionInput = useMemo(
        () =>
            product.status === 'available' && (
                <FormInput
                    name="description"
                    label="Descrição"
                    input={
                        <InputText
                            value={product.description || ''}
                            onChange={({ target: { value } }) => setProduct(old => ({ ...old, description: value }))}
                            placeholder="Descrição"
                        />
                    }
                />
            ),
        [product.status, product.description],
    );

    const sizesInput = useMemo(
        () =>
            product.status === 'available' && (
                <FormInput
                    name="sizes"
                    label="Tamanhos"
                    input={
                        <InputText
                            placeholder="P,M,G"
                            value={(sizes && sizes.join(',')) || ''}
                            onChange={({ target: { value } }) => setSizes(value ? value.split(',') : '')}
                        />
                    }
                />
            ),
        [product.status, sizes],
    );

    const colorsInput = useMemo(
        () =>
            product.status === 'available' && (
                <FormInput
                    name="colors"
                    label="Cores"
                    input={
                        <InputText
                            placeholder="Azul,Amarelo"
                            value={(colors && colors.join(',')) || ''}
                            onChange={({ target: { value } }) => {
                                const newColors = value.split(',');
                                setProduct(old => {
                                    const newQuantities = Object.entries(old.availableQuantities || {}).reduce((prev, [key, value]) => {
                                        if (newColors.some(color => key.endsWith(color))) return { ...prev, [key]: value };
                                        else return prev;
                                    }, {});
                                    return { ...old, availableQuantities: newQuantities };
                                });
                                setColors(value ? newColors : '');
                            }}
                        />
                    }
                />
            ),
        [product.status, colors],
    );

    const quantitiesInput = useMemo(
        () =>
            product.status === 'available' &&
            sizes.length && (
                <FormInput
                    name="quantities"
                    label="Quantidades"
                    input={
                        <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
                            {sizes.map(size =>
                                (colors.length ? colors : ['']).map(color => (
                                    <div
                                        key={`${size}-${color}`}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 2fr 2fr',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <label>{size}</label>
                                        <label>{color}</label>
                                        <InputText
                                            placeholder="1"
                                            value={(product.availableQuantities && product.availableQuantities[`${size}-${color}`]) || ''}
                                            onChange={({ target: { value } }) =>
                                                /^[0-9]*$/gm.test(value) &&
                                                setProduct(old => {
                                                    const newQuantities = Object.assign({}, old.availableQuantities || {});
                                                    newQuantities[`${size}-${color}`] = value;
                                                    return { ...old, availableQuantities: newQuantities };
                                                })
                                            }
                                        />
                                    </div>
                                )),
                            )}
                        </div>
                    }
                />
            ),
        [product.status, sizes, colors, product.availableQuantities],
    );

    const _inputs = [availabilityInput, priceInput, referenceIdInput, descriptionInput, sizesInput, colorsInput, quantitiesInput];
    const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);

    const validations = useMemo(
        () => [
            {
                name: 'availability',
                validation: value => value !== 'waitingInfo',
                value: product.status,
                message: 'Campo obrigatório',
            },
            ...(product.status !== 'available'
                ? []
                : [
                    {
                        name: 'price',
                        validation: ([price, totalQty]) => (totalQty > 0 ? !!price : true),
                        value: [product.price, Object.values(product.availableQuantities || {}).reduce((acc, prev) => acc + parseInt(prev), 0)],
                        message: 'Campo obrigatório',
                    },
                ]),
        ],
        [product],
    );
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow }}>
            {image}
            <div style={{ padding: '10px 10px 30px' }}>
                <Form buttonName="Atualizar" validations={validations} sendToBackend={update} inputs={inputs}/>
            </div>
        </div>
    );
};

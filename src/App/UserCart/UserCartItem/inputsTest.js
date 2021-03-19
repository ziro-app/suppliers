import React, { useMemo } from 'react'

import DropDown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import { card } from './styles'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'

const PTstatus = {
  available: 'Disponível',
  unavailable: 'Indisponível',
  closed: 'Disponível',
  waitingInfo: '',
  soldOut: 'Indisponível',
}

const INstatus = {
  Disponível: 'available',
  Indisponível: 'soldOut',
}

export default (image, product, setProduct, sizes, setSizes, colors, setColors, update) => {
  console.log('product de dentro do inputs test', product)
  const availabilityInput = (
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
  )

  const priceInput = product.status === 'available' && (
    <FormInput
      name="price"
      label="Preço"
      input={
        <InputText
          value={currencyFormat(product.price || '')}
          onChange={({ target: { value } }) => {
            const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
            setProduct(old => ({ ...old, price: maskInput(toInteger, '#######', true) }))
          }}
          placeholder="R$ 100,00"
          inputMode="numeric"
        />
      }
    />
  )

  const referenceIdInput = product.status === 'available' && (
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
  )

  const descriptionInput = product.status === 'available' && (
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
  )

  const sizesInput = product.status === 'available' && (
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
  )

  const colorsInput = product.status === 'available' && (
    <FormInput
      name="colors"
      label="Cores"
      input={
        <InputText
          placeholder="Azul,Amarelo"
          value={(colors && colors.join(',')) || ''}
          onChange={({ target: { value } }) => {
            const newColors = value.split(',')
            setProduct(old => {
              const newQuantities = Object.entries(old.availableQuantities || {}).reduce((prev, [key, value]) => {
                if (newColors.some(color => key.endsWith(color))) return { ...prev, [key]: value }
                else return prev
              }, {})
              return { ...old, availableQuantities: newQuantities }
            })
            setColors(value ? newColors : '')
          }}
        />
      }
    />
  )

  const quantitiesInput = product.status === 'available' && sizes.length && (
    <FormInput
      name="quantities"
      label="Quantidades"
      input={
        <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
          {colors.map(color =>
            (sizes.length ? sizes : ['']).map(size => (
              <div
                key={`${color}-${size}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 2fr',
                  alignItems: 'center',
                }}
              >
                <label>{color}</label>
                <label>{size}</label>
                <InputText
                  placeholder="1"
                  value={(product.availableQuantities && product.availableQuantities[`${color}-${size}`]) || ''}
                  onChange={({ target: { value } }) =>
                    /^[0-9]*$/gm.test(value) &&
                    setProduct(old => {
                      const newQuantities = Object.assign({}, old.availableQuantities || {})
                      newQuantities[`${color}-${size}`] = value
                      return { ...old, availableQuantities: newQuantities }
                    })
                  }
                />
              </div>
            )),
          )}
        </div>
      }
    />
  )

  const _inputs = [availabilityInput, priceInput, referenceIdInput, descriptionInput, colorsInput, sizesInput, quantitiesInput]
  return _inputs
}

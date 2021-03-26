import { centerInline, checkbox, gapBetweenFlexItems, quantitiesStyle } from '../../Products/styles'

import DropDown from '@bit/vitorbarbosa19.ziro.dropdown'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import React from 'react'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import { radioButtonContainer } from './styles'

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

export default (
  product,
  setProduct,
  sizes,
  setSizes,
  colors,
  setColors,
  update,
  defaultQuantityValue,
  device,
  states,
  dispatch,
  identifierOfPicture,
  updateCart,
) => {
  /*console.log(states, '-', identifierOfPicture, '-', states[`colors${identifierOfPicture}`]);*/
  //console.log('entrou states', states)
  console.log('entrou identifierOfPicture', identifierOfPicture)
  console.log('entrou states[`colors${identifierOfPicture}`]', states[`colors${identifierOfPicture}`])
  const descriptionInput = (
    <FormInput
      name="description"
      label="Descrição"
      input={
        <InputText
          // disabled={isSubmitting}
          value={'' || states[`description${identifierOfPicture}`]}
          onChange={({ target: { value } }) => {
            const payload = { userValue: value, identifierOfPicture, inputType: 'description' }
            dispatch(payload)
          }}
          placeholder="Descrição"
        />
      }
    />
  )
  const priceInput = (
    <FormInput
      name="price"
      label="Preço"
      input={
        <InputText
          // disabled={isSubmitting}
          value={'' || currencyFormat(states[`price${identifierOfPicture}`])}
          onChange={({ target: { value } }) => {
            const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
            const payload = {
              userValue: maskInput(toInteger, '#######', true),
              identifierOfPicture,
              inputType: 'price',
            }
            dispatch(payload)
          }}
          placeholder="R$ 100,00"
          inputMode="numeric"
        />
      }
    />
  )

  const discountPercentage = (
    <FormInput
      name="discount"
      label="Desconto"
      input={
        <InputText
          // disabled={isSubmitting}
          value={
            !states[`discount${identifierOfPicture}`] ? '' : `% ${currencyFormat(states[`discount${identifierOfPicture}`]).replace(/[R$]/g, '')}`
          }
          onChange={({ target: { value } }) => {
            const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10)

            const payload = {
              userValue: toInteger <= 10000 ? maskInput(toInteger, '#######', true) : maskInput(10000, '#######', true),
              identifierOfPicture,
              inputType: 'discount',
            }
            dispatch(payload)
          }}
          placeholder="% 20"
          inputMode="numeric"
        />
      }
    />
  )
  const discountPercentageCart = (
    <FormInput
      name="discount"
      label="Desconto"
      input={
        <InputText
          // disabled={isSubmitting}
          value={
            !states[`discountCart${identifierOfPicture}`]
              ? ''
              : `% ${currencyFormat(states[`discountCart${identifierOfPicture}`]).replace(/[R$]/g, '')}`
          }
          onChange={({ target: { value } }) => {
            const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10)

            const payload = {
              userValue: toInteger <= 10000 ? maskInput(toInteger, '#######', true) : maskInput(10000, '#######', true),
              identifierOfPicture,
              inputType: 'discountCart',
            }
            dispatch(payload)
          }}
          placeholder="% 20"
          inputMode="numeric"
        />
      }
    />
  )
  const typeSizeRadio = (
    <FormInput
      name="typeSize"
      label=""
      input={
        <div style={radioButtonContainer}>
          <div style={centerInline}>
            {states[`typeSize${identifierOfPicture}`] === 'number' ? (
              <Icon
                style={checkbox}
                type="circleChecked"
                size={15}
                strokeWidth={2}
                onClick={() => {
                  let payload = {
                    userValue: 'number',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: '36,38,40,42,44'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  }
                  dispatch(payload)
                }}
              />
            ) : (
              <Icon
                style={checkbox}
                type="circle"
                size={15}
                strokeWidth={2}
                onClick={() => {
                  let payload = {
                    userValue: 'number',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: '36,38,40,42,44'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  }
                  dispatch(payload)
                }}
              />
            )}
            <label style={gapBetweenFlexItems}>Numero</label>
          </div>
          <div style={centerInline}>
            {states[`typeSize${identifierOfPicture}`] === 'letter' ? (
              <Icon
                style={checkbox}
                type="circleChecked"
                size={15}
                strokeWidth={2}
                onClick={() => {
                  let payload = {
                    userValue: 'letter',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: 'P,M,G'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  }
                  dispatch(payload)
                }}
              />
            ) : (
              <Icon
                style={checkbox}
                type="circle"
                size={15}
                strokeWidth={2}
                onClick={() => {
                  let payload = {
                    userValue: 'letter',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  }
                  dispatch(payload)
                  payload = {
                    userValue: 'P,M,G'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  }
                  dispatch(payload)
                }}
              />
            )}
            <label style={gapBetweenFlexItems}>Letra</label>
          </div>
        </div>
      }
    />
  )

  const sizesInput = (
    <FormInput
      name="sizes"
      label="Tamanhos"
      input={
        <InputText
          // disabled={isSubmitting}
          placeholder="P,M,G"
          value={'' || (states[`sizes${identifierOfPicture}`] && states[`sizes${identifierOfPicture}`].join(','))}
          onChange={({ target: { value } }) => {
            const payload = {
              userValue: value ? value.split(',') : '',
              identifierOfPicture,
              inputType: 'sizes',
            }
            dispatch(payload)
          }}
        />
      }
    />
  )

  const colorsInput = (
    <FormInput
      name="colors"
      label="Cores"
      input={
        <InputText
          // disabled={isSubmitting}
          placeholder="Azul,Amarelo"
          value={
            '' ||
            (states[`colors${identifierOfPicture}`] && states[`colors${identifierOfPicture}`].join(',') ||
            (states[`colors${identifierOfPicture}`] && states[`colors${identifierOfPicture}`].join('')))
          }
          onChange={({ target: { value } }) => {
            const newColors = value ? value.split(',') : ['']
            const payload = {
              userValue: newColors,
              identifierOfPicture,
              inputType: 'colors',
            }
            dispatch(payload)
          }}
        />
      }
    />
  )

  const referenceIdInput = (
    <FormInput
      name="referenceId"
      label="Referência"
      input={
        <InputText
          value={'' || states[`referenceId${identifierOfPicture}`]}
          onChange={({ target: { value } }) => {
            const payload = {
              userValue: value.toUpperCase(),
              identifierOfPicture,
              inputType: 'referenceId',
            }
            dispatch(payload)
          }}
          placeholder="Referência da loja"
        />
      }
    />
  )

  const quantitiesInput = (states[`sizes${identifierOfPicture}`] !== '' || states[`colors${identifierOfPicture}`][0] !== '') && (
    <FormInput
      name="quantities"
      label="Quantidades"
      input={
        <div style={quantitiesStyle}>
          {states[`colors${identifierOfPicture}`] && states[`colors${identifierOfPicture}`].map(color =>
            (states[`sizes${identifierOfPicture}`]
              ? states[`sizes${identifierOfPicture}`].length
                ? states[`sizes${identifierOfPicture}`]
                : ['']
              : ['']
            ).map(size => (
              <div
                key={`${color}-${size}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: device === 'smallMobile' ? '2fr 1fr 2fr' : '2fr 1fr 1fr',
                  alignItems: 'center',
                }}
              >
                <label>{color}</label>
                <label>{size}</label>
                <InputText
                  // disabled={isSubmitting}
                  placeholder="1"
                  defaultValue={defaultQuantityValue}
                  value={
                    '' ||
                    (states[`availableQuantities${identifierOfPicture}`] && states[`availableQuantities${identifierOfPicture}`][`${color}-${size}`])
                  }
                  onChange={({ target: { value } }) => {
                    if (/^[0-9]*$/gm.test(value)) {
                      const result = old => {
                        const newQuantities = { ...(states[`availableQuantities${identifierOfPicture}`] || {}) }
                        newQuantities[`${color}-${size}`] = maskInput(value, '##', true)
                        return { ...old, availableQuantities: newQuantities }
                      }
                      const payload = {
                        userValue: result().availableQuantities,
                        identifierOfPicture,
                        inputType: 'availableQuantities',
                      }
                      dispatch(payload)
                    }
                  }}
                  inputMode="numeric"
                />
              </div>
            )),
          )}
        </div>
      }
    />
  )
  const availabilityInput = (
    <FormInput
      name="availability"
      label="Disponibilidade"
      input={
        <DropDown
          list={['Disponível', 'Indisponível']}
          value={PTstatus[product.status] || ''}
          onChange={({ target: { value } }) => {
            const status = INstatus[value] || 'waitingInfo'
            const payload = {
              userValue: status,
              identifierOfPicture,
              inputType: 'availability',
            }
            dispatch(payload)
          }}
          onChangeKeyboard={() => element => {
            const status = INstatus[element.value] || 'waitingInfo'
            const payload = {
              userValue: status,
              identifierOfPicture,
              inputType: 'availability',
            }
            dispatch(payload)
          }}
          placeholder="Está disponível em estoque?"
        />
      }
    />
  )
  /* const availabilityInput = (
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
                    return prev
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
                          const newQuantities = { ...(old.availableQuantities || {}) }
                          newQuantities[`${size}-${color}`] = value
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

      const discountPercentage = (
        <FormInput
          name="discount"
          label="Desconto"
          input={
            <InputText
              // disabled={isSubmitting}
              value={!product.discount ? '' : `% ${currencyFormat(product.discount).replace(/[R$]/g, '')}`}
              onChange={({ target: { value } }) => {
                const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10)

                setProduct(old => ({ ...old, discount: toInteger <= 10000 ? maskInput(toInteger, '#######', true) : maskInput(10000, '#######', true) }))
              }}
              placeholder="% 20"
              inputMode="numeric"
            />
          }
        />
      ) */
  /* const typeSizeRadio = (
        <FormInput
          name="typeSize"
          label=""
          input={
            <div style={radioButtonContainer}>
              <style>{checkmark}</style>
              <div>
                <label style={labelRadioButton} className="container">
                  <InputText
                    disabled={isSubmitting}
                    type="radio"
                    name="radio"
                    style={radioButton}
                    checked={states[`typeSize${identifierOfPicture}`] === 'number'}
                    onChange={() => {
                      let payload = {
                        userValue: 'number',
                        identifierOfPicture,
                        inputType: 'typeSize',
                      }
                      dispatch(payload)
                      payload = {
                        userValue: states[`colors${identifierOfPicture}`],
                        identifierOfPicture,
                        inputType: 'colors',
                      }
                      dispatch(payload)
                      payload = {
                        userValue: '36,38,40,42,44'.split(','),
                        identifierOfPicture,
                        inputType: 'sizes',
                      }
                      dispatch(payload)
                    }}
                  />
                  <span className="checkmark" />
                  Numero
                </label>
              </div>
              <div>
                <label style={labelRadioButton} className="container">
                  <InputText
                    disabled={isSubmitting}
                    type="radio"
                    name="radio"
                    style={radioButton}
                    checked={states[`typeSize${identifierOfPicture}`] === 'letter'}
                    onChange={() => {
                      let payload = {
                        userValue: 'letter',
                        identifierOfPicture,
                        inputType: 'typeSize',
                      }
                      dispatch(payload)
                      payload = {
                        userValue: states[`colors${identifierOfPicture}`],
                        identifierOfPicture,
                        inputType: 'colors',
                      }
                      dispatch(payload)
                      payload = {
                        userValue: 'P,M,G'.split(','),
                        identifierOfPicture,
                        inputType: 'sizes',
                      }
                      dispatch(payload)
                    }}
                  />
                  <span className="checkmark" />
                  Letra
                </label>
              </div>
            </div>
          }
        />
      ) */
  const arrayInputs = !updateCart
    ? [
        availabilityInput,
        descriptionInput,
        referenceIdInput,
        priceInput,
        discountPercentage,
        colorsInput,
        sizesInput,
        // typeSizeRadio,
        quantitiesInput,
      ]
    : [
        availabilityInput,
        descriptionInput,
        referenceIdInput,
        priceInput,
        discountPercentageCart,
        colorsInput,
        sizesInput,
        // typeSizeRadio,
        quantitiesInput,
      ]

  return arrayInputs
}

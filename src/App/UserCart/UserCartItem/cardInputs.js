import React, { memo, useCallback, useMemo, useState } from 'react'
import { button, card, editCardInputs, priceLabel } from './styles'

import Button from '@bit/vitorbarbosa19.ziro.button'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'

export default ({ update, updateCarts, image, arrayOfInputs, validations, isSubmitting, secondArrayOfInputs, product, setEditing }) => {
    console.log('entrou')
  const _inputs = arrayOfInputs
  //console.log('update cardInputs', update)
  //console.log('updateCarts', updateCarts)
  const [requestedQuantities, setRequestedQuantities] = useState(
    Object.entries(product.requestedQuantities || {}).filter(([, value]) => parseInt(value) > 0),
  )
  const setKeyQuantity = useCallback(
    (value, index) => {
      setRequestedQuantities(old => {
        let newQtys = Array.from(old)
        newQtys[index] = [value, '']
        newQtys = newQtys.filter(([s]) => s !== '')
        return newQtys
      })
    },
    [setRequestedQuantities],
  )
  const setValueQuantity = useCallback(
    (value, index) => {
      setRequestedQuantities(old => {
        const newQtys = Array.from(old)
        newQtys[index][1] = value
        return newQtys
      })
    },
    [setRequestedQuantities],
  )
  console.log('product inside cardInputs', product)
  const [reallyAvailableQuantities, arrays] = useMemo(
    () =>
      Object.keys(product.availableQuantities).reduce(
        (prev, cur) => {
          const r = (product.requestedQuantities || {})[cur]
          const a = product.availableQuantities[cur]
          const ia = parseInt(a)
          const ra = r ? parseInt(r) + ia : ia
          if (ra > 0) {
            const _array = Array.from(Array(ra).keys()).map(v => (v + 1).toString())
            return [
              { ...prev[0], [cur]: `${ra}` },
              { ...prev[1], [cur]: _array },
            ]
          }
          return prev
        },
        [{}, {}],
      ),
    [product.availableQuantities],
  )
  const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs)
  console.log('requestedQuantities', requestedQuantities)
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
      {
        secondArrayOfInputs && (
          <div style={editCardInputs}>
            <label style={priceLabel}>Escolher Variações</label>
            <div style={{ display: 'grid', gridRowGap: '1em' }}>
              {[...requestedQuantities, ['', '']].map(([key, qty], index) => {
                const keys = Object.keys(reallyAvailableQuantities).sort()
                if (index >= keys.length) return null
                return (
                  <div key={key === '' ? 'empty' : key} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridGap: '10px' }}>
                    <Dropdown
                      readOnly
                      list={keys.filter(_key => !requestedQuantities.map(([s]) => s).includes(_key))}
                      value={key}
                      onChange={({ target: { value } }) => setKeyQuantity(value, index)}
                      onChangeKeyboard={element => (element ? setKeyQuantity(element.value, index) : null)}
                      placeholder="Variações"
                    />
                    <Dropdown
                      readOnly
                      list={key !== '' ? arrays[key] : []}
                      value={qty}
                      onChange={({ target: { value } }) => setValueQuantity(value, index)}
                      onChangeKeyboard={element => (element ? setValueQuantity(element.value, index) : null)}
                      submitting={key === ''}
                      placeholder="Qtde"
                    />
                  </div>
                )
              })}
            </div>
            <Button
              // style={button}
              type="button"
              cta="Modificar o pedido"
              click={async () => {
                await updateCarts(requestedQuantities)
                setEditing(false)
              }}
            />
          </div>
        ) (
        <div style={{ padding: '10px 10px 20px' }}>
          <Form
            validations={[]}
            sendToBackend={updateCarts || null}
            inputs={secondArrayOfInputs}
            buttonName="Atualizar pedido"
            withoutBottomLabelOnSubmit
          />
        </div>
      )
      }
    </div>
  )
}

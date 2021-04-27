import * as types from "../types"

const inputsValidation = (validations: types.validations) => {
  const validFields: boolean[] = []
  const errorMessages: types.errorMessages = {}

  validations.map(validation => {
    const _validation = validation
    const fieldIsValid = _validation.validation(_validation.value)
    validFields.push(fieldIsValid)
    errorMessages[_validation.inputName] = fieldIsValid ? "" : _validation.message
  })

  const formIsValid = validFields.every(field => field)
  return [formIsValid, errorMessages]
}

export default inputsValidation

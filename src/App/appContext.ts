import { createContext } from "react"

interface IUserContext {
  uid: any
  fname: any
  lname: any
  cpf: any
  cnpj: any
  birthdate: any
  phone: any
  address: any
  neighborhood: any
  cep: any
  city: any
  cityState: any
  email: any
  userPos: any
  codBank: any
  holderName: any
  accountType: any
  accountNumber: any
  agency: any
  fantasia: any
  reason: any
  zoopId: any
  docId: any
  typeRegister: any
  ownerId: any
  role: any
  brand: any
  maxInstallments: any
  payoutAutomatic: any
  zoopBankAccountId: any
  whatsApp: any
  backgroundCheckRequests: any
  backgroundCheckRequestsPaid: any
  paymentsInsurance: any
}

export const userContext = createContext<IUserContext>({
  uid: null,
  fname: null,
  lname: null,
  cpf: null,
  cnpj: null,
  birthdate: null,
  phone: null,
  address: null,
  neighborhood: null,
  cep: null,
  city: null,
  cityState: null,
  email: null,
  userPos: null,
  codBank: null,
  holderName: null,
  accountType: null,
  accountNumber: null,
  agency: null,
  fantasia: null,
  reason: null,
  zoopId: null,
  docId: null,
  typeRegister: null,
  ownerId: null,
  role: null,
  brand: null,
  maxInstallments: null,
  payoutAutomatic: null,
  zoopBankAccountId: null,
  whatsApp: null,
  backgroundCheckRequests: null,
  backgroundCheckRequestsPaid: null,
  paymentsInsurance: null,
})

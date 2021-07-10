import { Dispatch, SetStateAction } from "react"

/** React - Atalho para Type de setState */
export type SetStateType<T> = Dispatch<SetStateAction<T>>

/** Firebase - Type basico para campos de timestamp */
export type Timestamp = {
  seconds: number
  nanoseconds: number
}

/** Firebase - Type de cada Revendedor */
export type Retailer = {
  address: Address
  business: Business
  dateCreated: Timestamp
  email: string
  person: Person
  uid: string
  zoopId: string
}

export type Address = {
  city: string
  neighborhood: string
  state: string
  street: string
  zip: string
}

export type Business = {
  cnpj: string
  razao: string
  fantasia: string
}

export type Person = {
  avatar: string
  name: string
  whatsapp: string
}

/** Firebase - Type de cada Produto adicionado no Carrinho */
export type CartProduct = {
  id: string
  information: {
    description: string
    discount: string
    images: string[]
    price: string
    reference: string
    title: string
  }
  selected: {
    [key: string]: number
  }
  status: string
  updatedBy: string
}

/** Firebase - Type de cada Pedido (Order) */
export type Order = {
  NO_ID_FIELD?: string
  /** objeto com as configurações do pedido */
  config:
    | {
        /** parcelamento máximo para compras no cartão */
        installmentsMax: string
        /** indica existência/ausência de seguro anti-fraude */
        insurance: boolean
        /** desconto no valor total do pedido, em percentual */
        orderDiscount: string
        /** objeto com as características do mínimo a ser comprado por pedido */
        orderMinimum: {
          /** tipo do mínimo por pedido */
          type: string
          /** valor do mínimo por pedido */
          value: string
        }
        /** valor do frete */
        shipping: string
      }
    | Record<string, never>
  /** data da criação do documento na collection do firebase */
  dateCreated: Timestamp
  /** data do update do documento na collection do firebase */
  dateUpdated: Timestamp
  /** id do pagamento na collection credit-card-payments */
  paymentId?: string
  /** id do revendedor na collection retailers */
  retailerUid: string
  /** status do pedido */
  status: "pendente-enviar" | "em-analise" | "pendente-confirmar" | "pendente-pagar" | "pagando" | "pago"
  /** id do fabricante na collection suppliers */
  supplierUid: string
  /** identifica se o último update veio do fabricante ou do revendedor */
  updatedBy: string
}

/** Firebase - Type de cada Fabricante (Supplier) */
export type Supplier = {
  id?: string // used if fetch comes directly from firebase API
  NO_ID_FIELD?: string // used if fetch comes from reactfire
  agencia: string
  alwaysInsured: boolean
  backgroundCheckCurrentMonth: number
  backgroundCheckCurrentYear: number
  backgroundCheckRequestsAvailable: number
  backgroundCheckRequestsAvailablePaid: number
  bairro: string
  cadastro: Timestamp
  categoria: string
  cep: string
  cidade: string
  cnpj: string
  codBanco: string
  cpf: string
  email: string
  endereco: string
  estado: string
  fantasia: string
  lastGalleryUpdate: Timestamp
  logo: string
  maxParcelas: string
  nascimento: string
  nome: string
  nomeBanco: string
  numConta: string
  payoutAutomatic: boolean
  razao: string
  segmento: string
  sellerZoopPlan: {
    activePlan: string
    financed14: PlanType
    financed30: PlanType
    standard: PlanType
  }
  sobrenome: string
  telefone: string
  tipoCadastro: string
  tipoConta: string
  titular: string
  uid: string
  whatsapp: string
  zoopBankAccountId: string
  zoopId: string
}

export type PlanType = {
  ziroAntifraudFee: FeeType
  ziroMarkupFee: FeeType
  zoopFee: FeeType
}

export type FeeType = {
  visa: InstallmentType
  hipercard: InstallmentType
  americanexpress: InstallmentType
  elo: InstallmentType
  mastercard: InstallmentType
}

export type InstallmentType = {
  installment0: string
  installment1: string
  installment2: string
  installment3: string
  installment4: string
  installment5: string
  installment6: string
  installment7: string
  installment8: string
  installment9: string
  installment10: string
  installment11: string
  installment12: string
}

/** Firebase - Type de cada produto */
export type CardType = {
  id?: string // used if fetch comes directly from firebase API
  NO_ID_FIELD?: string // used if fetch comes from reactfire
  dateCreated: {
    seconds: number
    nanoseconds: number
  }
  dateUpdated: {
    seconds: number
    nanoseconds: number
  }
  information: {
    description: string
    discount: string
    images: string[]
    price: string
    reference: string
    title: string
  }
  variations: {
    colors: string
    sizes: string
  }
}

/** Firebase - Type de cada categoria */
export type Category = {
  cover: string
  description: string
}

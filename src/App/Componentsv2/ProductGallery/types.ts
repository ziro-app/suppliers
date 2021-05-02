import { MouseEventHandler } from "react"

export interface CardType {
  NO_ID_FIELD: string
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
  }
  variations: {
    colors: string
    sizes: string
  }
}

export interface CardProps {
  /** propriedades do card */
  card: CardType
  /** onClick passada pelo Link */
  onClick?: MouseEventHandler
}

export interface ProductGalleryProps {
  /** estado de loading do componente */
  isLoading: boolean
  /** array com as informacoes dos cards de produto */
  cards: CardType[]
  /** URL base para navegação dos produtos quando estes sao clicados */
  baseUrl: string
  /** the maximum number of cards that will de displayed on screen before pagination starts */
  skeletonCount: number
}

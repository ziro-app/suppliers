import { MouseEventHandler, SyntheticEvent, MouseEvent } from "react"
import { Order, CardType } from "@bit/ziro.utils.types"

export interface CardProps {
  /** propriedades do card */
  card: CardType
  /** onClick passada pelo Link */
  onClick?: MouseEventHandler
  /** id do supplier no firebase */
  supplierUid: string
  /** array com as informacoes dos cards de produto */
  cards?: CardType[]
  /** array contendo os pedidos contidos no carrinho do usuario */
  orders?: Order[]
  /** sinaliza que o scroll infinito deve terminar, pois não há mais itens no firebase para buscar */
  endOfGallery?: boolean
}

export interface ProductGalleryProps {
  /** array com as informacoes dos cards de produto */
  cards: CardType[]
  /** id do supplier no firebase */
  supplierUid: string
  /** URL base para navegação dos produtos quando estes sao clicados */
  baseUrl: string
  /** the maximum number of cards that will de displayed on screen before pagination starts */
  skeletonCount: number
  /** array contendo os pedidos contidos no carrinho do usuario */
  orders?: Order[]
  /** sinaliza que o scroll infinito deve terminar, pois não há mais itens no firebase para buscar */
  endOfGallery?: boolean
  /** estado de loading do componente */
  isLoading: boolean
}

export interface ProductImagesProps {
  images: string[]
  onDragStart?: (event: SyntheticEvent) => void
  handleClick?: (event: MouseEvent, onClick: MouseEventHandler) => void
  onClick?: MouseEventHandler
  isInCart?: boolean
}

export interface LoaderProps {
  isLoading: boolean
  hasScrollBar: boolean
  pageEnd: boolean
  endOfGallery: boolean
  allowPagination: boolean
}

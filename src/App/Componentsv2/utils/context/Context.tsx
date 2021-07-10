import { createContext } from "react"
import { Retailer, Supplier, Order } from "@bit/ziro.utils.types"

export const UserContext = createContext<Retailer | null>(null)
export const UserContextSupplier = createContext<Supplier | null>(null)
export const OrdersContext = createContext<Order[]>([])

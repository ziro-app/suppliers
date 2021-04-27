import { lazy } from "react"
import * as Illustrations from "./Illustrations"

export const loader = (name: keyof typeof Illustrations) =>
  ({
    Account: lazy(() => import("./Illustrations/Account")),
    Chatting: lazy(() => import("./Illustrations/Chatting")),
    CnhPhoto: lazy(() => import("./Illustrations/CnhPhoto")),
    ErrorLoading: lazy(() => import("./Illustrations/ErrorLoading")),
    NoData: lazy(() => import("./Illustrations/NoData")),
    CardAnalysis: lazy(() => import("./Illustrations/CardAnalysis")),
    CreditCard: lazy(() => import("./Illustrations/CreditCard")),
    NotFound: lazy(() => import("./Illustrations/NotFound")),
    NoteList: lazy(() => import("./Illustrations/NoteList")),
    OnlinePosts: lazy(() => import("./Illustrations/OnlinePosts")),
    OnlyVestuary: lazy(() => import("./Illustrations/OnlyVestuary")),
    PaymentError: lazy(() => import("./Illustrations/PaymentError")),
    PaymentSuccess: lazy(() => import("./Illustrations/PaymentSuccess")),
    Receipt: lazy(() => import("./Illustrations/Receipt")),
    RegisterSuccess: lazy(() => import("./Illustrations/RegisterSuccess")),
    Security: lazy(() => import("./Illustrations/Security")),
    SecurityTwo: lazy(() => import("./Illustrations/SecurityTwo")),
    SelfieOne: lazy(() => import("./Illustrations/SelfieOne")),
    SelfieTwo: lazy(() => import("./Illustrations/SelfieTwo")),
    TimelineStart: lazy(() => import("./Illustrations/TimelineStart")),
    UpgradePlan: lazy(() => import("./Illustrations/UpgradePlan")),
    Waiting: lazy(() => import("./Illustrations/Waiting")),
    WithoutCartItem: lazy(() => import("./Illustrations/WithoutCartItem")),
    WithoutFavorites: lazy(() => import("./Illustrations/WithoutFavorites")),
    BugFixRed: lazy(() => import("./Illustrations/BugFixRed")),
  }[name])

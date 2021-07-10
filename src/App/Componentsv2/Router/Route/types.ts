import { ReactNode } from "react"

interface CommonProps {
  path: string
  children: ReactNode
  PublicOnlyFallback?: ReactNode
  PrivateFallback?: ReactNode
}

interface isPublicOnlyProps extends CommonProps {
  isPublicOnly: true
  isPrivate?: never
}

interface isPrivateProps extends CommonProps {
  isPublicOnly?: never
  isPrivate: true
}

interface isPublicProps extends CommonProps {
  isPublicOnly?: never
  isPrivate?: never
}

export type RouteProps = isPublicOnlyProps | isPrivateProps | isPublicProps

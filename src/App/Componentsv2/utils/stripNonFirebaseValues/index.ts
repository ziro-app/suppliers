export type Stripped<T> = T extends undefined | ((...args: any) => any) ? null : T extends object ? StrippedObj<T> : T
export type StrippedObj<T extends object> = { [K in keyof T]: Stripped<T[K]> }

const stripNonFirebaseValues = <T>(obj: T): Stripped<T> => {
  switch (typeof obj) {
    case "number":
    case "string":
      return obj as any
    case "undefined":
    case "function":
      return null as any
    case "object": {
      if (obj === null) return null as any
      if (Array.isArray(obj)) return (obj as any).map(stripNonFirebaseValues)
      return Object.entries(obj).reduce((acc, [k, v]) => ({ ...acc, [k]: stripNonFirebaseValues(v) }), {}) as any
    }
    default:
      return null as any
  }
}

export default stripNonFirebaseValues

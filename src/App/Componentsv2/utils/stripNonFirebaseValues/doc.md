# strip-non-firebase-values

Essa função retira de um objeto todos os valores `undefined` e `function`, deixando `null` no lugar,
o intuito é ser utilizada para impedir erros de escrita no firebase, que não aceita estes valores.

### Example

```typescript
import strip from "@bit/ziro.utils.strip-non-firebase-values"

const someData = {
  someStr: "str",
  someNum: 1,
  someUndef: undefined,
  someFunc: () => {},
}

someFirebaseDoc.set(someData)
// FIREBASE ARGUMENT ERROR

const strippedData = strip(someData)
//  strippedData = {
//      someStr: "str",
//      someNum: 1,
//      someUndef: null,
//      someFunc: null
//  }

someFirebaseDoc.set(strippedData)
// SUCCESSFULLLY WRITTEN
```

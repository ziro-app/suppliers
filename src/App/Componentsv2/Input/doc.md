Este componente exporta alguns inputs prontos (InputEmail, InputMoney, InputPercentage, InputPhone) ja contendo placeholder, tratamento de dado e mascara.

Exporta tambem um input generico (InputText) no qual e possivel montalo da maneira necessaria.
Os inputs podem ser usados de duas formas:

- Utilizando estados locais (useState do React);
- Utilizando estados globais (gerados pelo createFactory).

# Como usar

## Utilizando estados locais (verificar draft 1 para exemplo completo)

Realizar o import do componente sem factory no nome:

```typescript
import { InputText } from "@bit/ziro.views.input"
```

Criar um estado local utilizando useState do React:

```typescript
const [name, setName] = useState("")
```

Utilizar o componente passando suas propriedades, e o estados criados:

```typescript
<InputText inputName="username" placeHolder="Digite seu nome" value={name} setValue={setName} />
```

A partir dai e possivel utilizar o estado localmente da maneira que for necessário.

## Utilizando estados globais (verificar draft 2 para exemplo completo)

Realizar o import do componente que contem factory no nome.

```typescript
import { InputTextFactory } from "@bit/ziro.views.input"
```

Entao é necessário invocar a factory passando as configs para criar o componente e useState global (invocar fora do componente ou utilizar dentro de useMemo)

```typescript
const { render: InptText, useState: textState } = useMemo(() => InputTextFactory(InputTextConfig), [])
```

E possivel importar configs padroes do componente:

```typescript
import { InputTextConfig } from "@bit/ziro.views.input"
```

Ou caso deseje criar suas proprias configs, a estrutura e a seguinte:

```typescript
const InputTextConfig = { name: "InputText", initialState: { userInput: "" } }
```

Para utilizar os estados criados pela factory:

```typescript
const [text, setText] = textState()
```

Para utilizar o componente basta chama-lo passando suas props (NAO PASSAR VALUE NEM SETVALUE)

```typescript
<InptText inputName="text" placeHolder="Texto exemplo" />
```

# Props aceitas em cada input

## Comun a todos os inputs

| Nome       | Requerido | Tipo               | Valor padrao | Descricao                                                                                        |
| ---------- | --------- | ------------------ | ------------ | ------------------------------------------------------------------------------------------------ |
| inputName  | SIM       | string             |              | Nome para referenciar o campo de input                                                           |
| value      | NAO       | string             |              | Variavel a qual o valor e exibido no input (nao passar ao utilizar factory)                      |
| setValue   | NAO       | ReactDispatch      |              | Funcao do setState para setar uma variavel com o valor do input (nao passar ao utilizar factory) |
| isLoading  | NAO       | boolean            |              | Quando este parametro e true o input assume seu estado disabled                                  |
| inputError | NAO       | string             |              | Mensagem exibida quando o input do usuario e invalido                                            |
| style      | NAO       | ReactCSSProperties |              | Usado para passar um estilo customizado ao input                                                 |

## InputMoney

| Nome           | Requerido | Tipo   | Valor padrao | Descricao                        |
| -------------- | --------- | ------ | ------------ | -------------------------------- |
| monetarySymbol | NAO       | string | R$           | Simbolo monetario usado no input |

## InputText

| Nome        | Requerido | Tipo                                                  | Valor padrao | Descricao                                                                               |
| ----------- | --------- | ----------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| inputType   | NAO       | email, number, password, search, text, url            | text         | Tipo HTML do input                                                                      |
| placeHolder | SIM       | string                                                |              | Placeholder mostrado antes de ser inserido algum valor no input                         |
| inputMode   | NAO       | none, text, tel, url, email, numeric, decimal, search | text         | Usado para definir o tipo de dado do campo e do teclado mostrado em dispositivos moveis |

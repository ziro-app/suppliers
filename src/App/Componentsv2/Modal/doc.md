Componente de modal, que e possivel utilizar com estados locais (useState do react) ou globais (utilizando componente factory).

O que é renderizado dentro do modal, é passado para ele, através de children, portanto é possível montar um modal da forma que quiser.

# Como usar

## Utilizando estados locais (verificar draft 1 para exemplo completo)

Realizar o import do componente sem factory no nome:

```typescript
import { Modal } from "@bit/ziro.views.modal"
```

Criar um estado local utilizando useState do React:

```typescript
<Modal showModal={showModal} setShowModal={setShowModal}>
  <h1 style={{ textAlign: "center" }}>Olá eu sou um Modal</h1>
</Modal>
```

Utilizar o componente passando suas propriedades, e o estados criados:

```typescript
<InputText inputName="username" placeHolder="Digite seu nome" value={name} setValue={setName} />
```

A partir dai e possivel utilizar o estado localmente da maneira que for necessário.

## Utilizando estados globais (verificar draft 2 para exemplo completo)

Realizar o import do componente que contem factory no nome.

```typescript
import { ModalFactory } from "@bit/ziro.views.modal"
```

Entao é necessário invocar a factory passando as configs para criar o componente e useState global (invocar fora do componente ou utilizar dentro de useMemo)

```typescript
const fModalConfig = {
  name: "modal",
  initialState: { userInput: false },
}

const { render: FModal, useState: fModalState } = useMemo(() => {
  return ModalFactory(fModalConfig)
}, [])
```

Para utilizar os estados criados pela factory:

```typescript
const [showModal, setShowModal] = fModalState()
```

Para utilizar o componente basta chama-lo passando suas props (NAO PASSAR ESTADO DE EXIBICAO)

```typescript
<FModal>
  Olá eu sou um modal criado com factory
</FModal>
```

# Props aceitas no modal

| Nome             | Requerido | Tipo          | Valor padrao | Descricao                                                                        |
| ---------------- | --------- | ------------- | ------------ | -------------------------------------------------------------------------------- |
| showModal        | NAO       | boolean       |              | Variavel que define se o modal e exibido ou nao (nao passar ao utilizar factory) |
| setShowModal     | NAO       | ReactDispatch |              | Funcao que seta variavel de exibicao do modal (nao passar ao utilizar factory)   |
| showCloseButton  | NAO       | boolean       | true         | Mostrar ou nao botao de fechar o modal                                           |
| closeButtonColor | NAO       | string        | "#222"       | Cor do botao de fechar o modal                                                   |
| children         | SIM       | ReactNode     |              | Corpo do modal                                                                   |

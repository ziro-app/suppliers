# Como usar

Importar o form

```typescript
import Form from "@bit/ziro.views.form"
```

Chamar o componente passando como parametros, validations (array de objetos com as validacoes dos campos) e onSubmit (funcao que sera executada ao submeter o form).

```typescript
<Form validations={validation} onSubmit={() => onSubmit()}>
  // Inputs // Botao para submeter
</Form>
```

## Validations

As validations devem seguir o seguinte modelo

```typescript
const validation = [
  {
    inputName: "" // Nome do campo que sera validado com esta validation
    validation: () => {} // Funcao que retorna true caso o campo seja valido, ou false caso invalido
    value: {"variavel"} // Variavel value do campo, usada na funcao de validacao
    message: "" // Mensagem de erro exibida no input caso seja invalido
  }
]
```

## onSubmit

A funcao de submissao do form, deve retornar sempre um modal, e os states deste modal. Em casos de sucesso ou falhas.

# Olhar Draft para um exemplo completo de uso

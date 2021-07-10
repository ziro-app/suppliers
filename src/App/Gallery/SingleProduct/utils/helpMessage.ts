const helpMessage = (inputName: string) => {
  const messages: { [key: string]: { header: string; body: string } } = {
    images: {
      header: "Imagens",
      body: "As fotos do seu produto. Atenção: sempre que adicionar uma foto, o sistema apagará todas as anteriores.",
    },
    title: {
      header: "Título",
      body: "O nome do produto. Aparecerá em destaque na galeria e chamará atenção do revendedor.",
    },
    description: {
      header: "Descrição",
      body: "São os dados do seu produto. Descreva as especificações necessárias para a compra",
    },
    price: {
      header: "Preço",
      body: "Valor a cobrar por unidade vendida.",
    },
    discount: {
      header: "Desconto",
      body: "Valor percentual aplicado apenas no produto.",
    },
    reference: {
      header: "Referência",
      body: "O número único que você já usa para identificar o produto nos seus controles internos.",
    },
    colors: {
      header: "Opções",
      body: "As opções possíveis, separadas por vírgula. Determinará as variações do produto, junto com os tamanhos. Exemplos: Alfazema,Alecrim ou Amarelo,Azul",
    },
    sizes: {
      header: "Tamanhos",
      body: "Os tamanhos possíveis, separados por vírgula. Determinará as variações do produto, junto com as opções. Exemplos: P,M,G ou 34,36,38 ou 200ml,500ml",
    },
  }
  return messages[inputName]
}

export default helpMessage

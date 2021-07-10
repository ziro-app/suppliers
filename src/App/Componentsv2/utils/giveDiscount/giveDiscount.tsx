export const giveDiscount = (preco: string, desconto: string) => {
  if (Number(desconto) > 0 && desconto !== "") {
    const calculaDesconto = (Number(preco) * Number(desconto)) / 100
    return Number(preco) - calculaDesconto
  }
  return false
}

export const config = {
  /** Nome que aparece na tela de login: "Bem vindo, {audience}" */
  audience: "Usuário",
  /* Nome da collection no firebase. Usada em ações de login, criação e gerência de conta */
  collectionName: "retailers",
  /** Rota básica com domínio de produção para app revendedores */
  baseUrl: "http://localhost:1234",
  /** Rota básica com domínio de produção para app fabricantes */
  baseUrlSupplier: "http://localhost:7070",
  /** Rota para o flow de galeria do revendedor */
  galleryRoute: "/galeria",
  /** Rota para o flow de carrinho do revendedor */
  cartRoute: "/carrinho",
  /** Rota para o flow de gestão de conta */
  preferencesRoute: "/conta",
  /** Rota para o flow de carrinho do fabricante */
  supplierCartRoute: "/carrinho-fabricante",
  /** Rota para o flow de upload de produtos do fabricante */
  gallerySupplierRoute: "/galeria-fabricante",
  /** Rota para o flow de pagamento */
  paymentRoute: "/pagamento",
  /** URL da continueUrl necessária para autenticação via firebase */
  authContinueUrl: "https://ziro-app.netlify.app/", // -------------------------------> TODO: Trocar para novo domínio. Também no firebase: https://console.firebase.google.com/project/ziro-app-data/authentication/providers
  /* Variável de refêrencia a url para a deleção do recurso na Zoop (API pay) */
  zoopResourceDelete: "/buyer-delete?buyer_id=",
}

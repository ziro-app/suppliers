export const instanceConfig: import("axios").AxiosRequestConfig = {
    baseURL: process.env.PAY_URL,
    headers: { Authorization: `${process.env.PAY_TOKEN}` },
    timeout: 40000,
},
URLs = {
    getCard: "/card-read",
    getReceivables: "/payments-read-receivables",
    deleteCard: "/card-delete",
    createCardToken: "/token-card-create",
    associateCard: "/card-associate",
    createBuyer: "/buyer-create",
    createPayment: "/payments-create",
    voidPayment: "/payments-void",
};

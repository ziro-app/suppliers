import { RegisteredTransaction, GetReceivables } from "@bit/vitorbarbosa19.ziro.pay.zoop";
import { CreditCardPayments } from "@bit/vitorbarbosa19.ziro.firebase.credit-card-payments";
import { formatDateUTC3 } from "@ziro/format-date-utc3";
import currencyFormat from "@ziro/currency-format";
import translateStatus from "./translateStatus";
import prepareReceivables from "./prepareReceivables";
import type firebase from "firebase";

export const dbAndSheet = (
    {
        id: transactionId,
        status,
        amount,
        payment_type,
        payment_method,
        installment_plan,
        sales_receipt,
        gateway_authorizer: authorizer,
        fee_details,
        fees,
        split_rules,
        created_at,
        valueCreditBackgroundCheck
    }: any,//RegisteredTransaction.Response,
    buyer,
    receivables: GetReceivables.Response | undefined,
    timestamp: () => firebase.firestore.FieldValue,
) => {
    const installments = installment_plan.number_installments;
    const type = payment_type === "credit" ? "crédito" : "";
    const { holder_name, first4_digits, last4_digits, card_brand } = payment_method;
    const receivablesData = prepareReceivables(receivables, transactionId, fee_details, fees);
    const sheetData = [
        transactionId,
        formatDateUTC3(new Date(created_at)),
        translateStatus(status),
        type,
        1,
        'Ziro',
        buyer.fantasy,
        holder_name.trim().toLowerCase(),
        card_brand,
        `${first4_digits}...${last4_digits}`,
        currencyFormat(parseFloat(amount).toFixed(2).replace(".", "")).replace("R$", ""),
        ...receivablesData.feeDetailsSheet,
    ];
    let dbData: any = {
            status: translateStatus(status),
            dateLinkCreated: timestamp(),
            dateLastUpdated: timestamp(),
            datePaid: timestamp(),
            sellerName: 'Ziro',
            sellerZoopId: process.env.SELLER_ID_ZIRO,
            installments:1,
            installmentsMax: 1,
            productType:'backgroundCredit',
            valueCreditBackgroundCheck,
            buyerZoopId:buyer.zoopId,
            buyerReason:buyer.reason,
            buyerDocId:buyer.docId,
            buyerFantasy:buyer.fantasy,
            quantity:buyer.quantityNumber,
            cardBrand: card_brand,
            payment:type,
            cardFirstFour: first4_digits,
            cardLastFour: last4_digits,
            cardholder: holder_name.toLowerCase(),
            charge: Number(amount),
            sales_receipt,
            transactionZoopId: transactionId,
            fees,
            fee_details: receivablesData.feeDetailsDB,
            totalFees: receivablesData.total,
            receivables: receivablesData.receivablesDB,
    };
    return [dbData, sheetData, receivablesData.receivablesSheet] as const;
};

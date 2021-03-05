import { RegisteredTransaction, GetReceivables } from "../../../Zoop";
import { CreditCardPayments } from "../../../../../utils/firebase/credit-card-payments";
import { formatDateUTC3 } from "@ziro/format-date-utc3";
import { Storeowner } from "../../../../../utils/firebase/storeowners";
import currencyFormat from "@ziro/currency-format";
import splitRules from "../splitRules";
import translateStatus from "../translateStatus";
import prepareReceivables from "../prepareReceivables";
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
    }: RegisteredTransaction.Response,
    { seller, sellerZoopPlan, onBehalfOfBrand, insurance, checkoutWithoutRegister }: any,
    zoopId,
    receivables: GetReceivables.Response | undefined,
    timestamp: () => firebase.firestore.FieldValue,
) => {
    const installments = installment_plan.number_installments;
    const type = payment_type === "credit" ? "crédito" : "";
    const { holder_name, first4_digits, last4_digits, card_brand } = payment_method;
    const [antiFraud, markup] = splitRules({ split_rules, sellerZoopPlan, card_brand, installments, insurance });
    const sellerName = seller === "Ziro" && onBehalfOfBrand ? `Ziro - ${onBehalfOfBrand}` : seller;
    const receivablesData = prepareReceivables(receivables, transactionId, fee_details, fees, { antiFraud, markup }, insurance);
    const reason = zoopId;
    const sheetData = [
        transactionId,
        formatDateUTC3(new Date(created_at)),
        translateStatus(status),
        type,
        installments,
        sellerName,
        reason,
        holder_name.trim().toLowerCase(),
        card_brand,
        `${first4_digits}...${last4_digits}`,
        currencyFormat(parseFloat(amount).toFixed(2).replace(".", "")).replace("R$", ""),
        ...receivablesData.feeDetailsSheet,
    ];
    let dbData: any = {
        status: translateStatus(status),
        installments,
        datePaid: timestamp(),
        dateLastUpdate: timestamp(),
        cardBrand: card_brand,
        cardholder: holder_name.toLowerCase(),
        cardFirstFour: first4_digits,
        cardLastFour: last4_digits,
        transactionZoopId: transactionId,
        receiptId: sales_receipt,
        splitTransaction: {
            antiFraud,
            markup,
        },
        authorizer,
        onBehalfOfBrand: onBehalfOfBrand ?? "",
    };
    if (checkoutWithoutRegister) {
        dbData.buyerRazao = reason;
    }
    /*if (storeownerId !== "-") {
        dbData.buyerStoreownerId = storeownerId;
        dbData.buyerRazao = razao;
    }*/
    if (!insurance) {
        dbData = {
            ...dbData,
            fees,
            fee_details: receivablesData.feeDetailsDB,
            totalFees: receivablesData.total,
            receivables: receivablesData.receivablesDB,
        };
    }
    return [dbData, sheetData, receivablesData.receivablesSheet] as const;
};

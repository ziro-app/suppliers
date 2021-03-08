// @ts-nocheck
import { useFirestore, useFirestoreDoc, useFirestoreDocData } from "reactfire";
import { CreditCardPaymentDocumentRef, CreditCardPaymentDocument, CreditCardPayments } from "./hookTypes";

export * from "./hookTypes";

/**
 * Esse hook retorna um DocumentReferece do credit-card-payment referente ao id passado
 * @param id o id do credit-card-payment
 */
export const usePaymentSellersZiroDocumentRef = (id: string) => {
    if (!id) throw new Error("usePaymentSellersZiroDocumentRef was called with no id");
    return useFirestore().collection("payments-sellers-ziro").doc(id) as CreditCardPaymentDocumentRef;
};

/**
 * Esse hook retorna o documento referente ao credit-card-payment com esse id
 * @param id o id do credit-card-payment
 * @param startWithValue valor inicial, se for fornecido o hook não irá dar throw na promise (modo suspense)
 */
export const usePaymentsSellersZiro = <T = CreditCardPaymentDocument>(id?: string, startWithValue?: T): CreditCardPaymentDocument | T => {
    const ref = usePaymentSellersZiroDocumentRef(id || "-");
    const options: any = { startWithValue };
    const hookResult: any = useFirestoreDoc(ref, options).data;
    return id ? hookResult : startWithValue;
};

/**
 * Esse hook retorna os dados do documento referente ao credit-card-payment com esse id
 * @param id o id do credit-card-payment
 * @param startWithValue valor inicial, se for fornecido o hook não irá dar throw na promise (modo suspense)
 */
export const usePaymentSellersZiroDocumentData = <T = CreditCardPayments.FirebaseDocument>(
    id?: string,
    startWithValue?: T,
): CreditCardPayments.FirebaseDocument | T => {
    const ref = usePaymentSellersZiroDocumentRef(id || "-");
    const options: any = { startWithValue };
    const hookResult: any = useFirestoreDocData(ref, options).data;
    return id ? hookResult : startWithValue;
};

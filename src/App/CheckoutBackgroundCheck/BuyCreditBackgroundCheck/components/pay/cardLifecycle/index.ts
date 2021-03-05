import { usePromiseShowingMessage, useAsyncEffect, usePromise, PromiseCbk, UsePromiseState } from "@bit/vitorbarbosa19.ziro.utils.async-hooks";
import { useMessage, useMessagePromise } from "@bit/vitorbarbosa19.ziro.message-modal";
import * as delMessages from "ziro-messages/dist/src/catalogo/pay/chooseCard";
import * as regMessages from "ziro-messages/dist/src/catalogo/antifraude/registerCard";
import * as payMessages from "ziro-messages/dist/src/catalogo/pay/checkout";
import {
    deleteCard,
    createPayment,
    associateCard,
    createCardToken,
    UnregisteredCard,
    voidPayment,
    getReceivables,
    UnregisteredTransaction,
    GetCard,
    RegisteredTransaction,
} from '../Zoop';
//@ts-ignore
//import { useAnimatedLocation } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { useCancelToken } from "@bit/vitorbarbosa19.ziro.utils.axios";
import { useFirebaseCardsCollectionRef, useCartCollectionRef, useCatalogUserDataDocument } from "../../../utils/firebase/catalog-user-data";
import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useZoopRegistration } from "../zoopRegistration"
import { useCreditCardPaymentDocument } from "../../../utils/firebase/credit-card-payments";
import creator from "./dataCreators";
import * as errorThrowers from "./errorThrowers";
import writeTransactionToSheet from "./utils/writeTransactionToSheet";
import writeReceivablesToSheet from "./utils/writeReceivablesToSheet";
import { sheet } from "@bit/vitorbarbosa19.ziro.utils.sheets";
import { useStoreowner } from "../../../utils/firebase/storeowners";
import * as Sentry from "@sentry/react";
import { paymentSuccessUserResolution } from "./paymentSuccessUserResolution";
import {useLocation} from 'wouter'
import { db } from '../../../../../../Firebase/index'

/**
 * Esse hook retorna um callback para excluir um cartão
 */
export const useDeleteCard = () => {
    const source = useCancelToken();
    const collectionRef = useFirebaseCardsCollectionRef();
    const setMessagePromise = useMessagePromise();
    const [cbk, state] = usePromiseShowingMessage<string, any, any>(delMessages.waiting.DELETING_CARD, async (id) => {
        await deleteCard(id, source.token);
        await collectionRef.doc(id).delete().catch(errorThrowers.deleteFirestore);
    });
    const newCbk = useCallback(
        (id: string) => {
            setMessagePromise(delMessages.prompt.DELETE_CARD)
                .then(() => cbk(id))
                .catch(() => null);
        },
        [setMessagePromise, cbk, delMessages],
    );

    const running = useMemo(() => state.status === "running", [state.status]);

    return [newCbk, running] as [typeof newCbk, typeof running];
};

export const useRegistrationTransaction = () => {
    const source = useCancelToken();
    const query = useFirestore().collection("suppliers").where("fantasia", "==", "ZIRO");
    const zoopId = useZoopRegistration();
    const [supplier] = useFirestoreCollectionData<{ zoopId: string }>(query).data;
    return useCallback(
        async (card: UnregisteredCard | RegisteredTransaction.Card) => {
            const amount = Math.round(10 + Math.random() * 140);
            const transaction = await createPayment(creator.registrationPaymentData(card, supplier.zoopId, zoopId, amount), source.token);
            await voidPayment(creator.registrationVoidData(transaction), source.token);
            return transaction;
        },
        [source, supplier, zoopId],
    );
};

/**
 * Esse hook retorna um callback para registrar um cartão
 */
export const useRegisterCard = (onSuccess: (data: { card_id: string; transaction: boolean }) => void) => {
    const source = useCancelToken();
    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;
    const collectionRef = useFirebaseCardsCollectionRef();
    const timestamp = useFirestore.FieldValue.serverTimestamp;
    const zoopId = useZoopRegistration();
    const setMessage = useMessage();
    const transact = useRegistrationTransaction();
    return usePromise<UnregisteredCard & { shouldTransact: boolean }, void, never>(async ({ shouldTransact, ...card }) => {
        const promise = (async () => {
            let transaction: UnregisteredTransaction.Response;
            if (shouldTransact) transaction = await transact(card);
            const { id: token } = await createCardToken(card, source.token);
            const { id: card_id } = await associateCard(token, zoopId, source.token);
            await collectionRef
                .doc(card_id)
                .set(creator.firebaseCardData(timestamp, transaction))
                .catch(errorThrowers.saveFirestore("register-card"));
            onSuccessRef.current({ card_id, transaction: !!transaction });
        })().catch((error) => error);
        setMessage(
            (shouldTransact
                ? regMessages.waiting.REGISTERING_CARD
                : regMessages.waiting.REGISTERING_CARD.set("userDescription", "Estamos vinculando seu cartão de forma segura.")
            ).withPromise(promise),
        );
        const result = await promise;
        if (result) setMessage(result);
    });
};

export function usePayment(
    onSuccess: (dbData: ReturnType<typeof creator.registeredPayment.dbAndSheet>[0]) => void,
    id: string,
    supplierId: string,
    zoopId: string,
    installments:string,
    brand:string,
    card:object
)
export function usePayment(onSuccess: (dbData: any) => void, id: string, supplierId:string,zoopId:string, installments: string,brand:string, card: object) {
    const source = useCancelToken();
    console.log('teste')
    console.log('id',id)
    console.log('supplierId',supplierId)
    console.log('zoopId',zoopId)
    console.log('installments',installments)
    console.log('card',card)
    const payment = useCreditCardPaymentDocument(id);
    if(payment)console.log('payment',payment)
    //const storeowner = useStoreowner();
    const errorsCollection = useFirestore().collection("credit-card-errors");
    const timestamp = useFirestore.FieldValue.serverTimestamp;
    const [, setLocation] = useLocation();
    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;
    const [cbk, state] = usePromiseShowingMessage(payMessages.waiting.SENDING_PAYMENT, async ({ installments, ...card }: any = {}) => {

        console.log('payment 2 entrou')
        if (!installments) throw payMessages.prompt.NO_INSTALLMENTS;
        const i: string = installments;
        const paymentData = payment;
        console.log('payment 2',paymentData)
        if (paymentData.status === "Aprovado" || paymentData.status === "Pré Autorizado")
            throw payMessages.prompt.PAYMENT_SUCCESS.set("title", "Pagamento já realizado")
                .set("userDescription", "O pagamento desta transação já foi realizado.")
                .set("userResolution", "Retorne a tela de pagamentos para verificar o status do pagamento.")
                .withButtons([
                    {
                        title: payment.data().checkoutWithoutRegister ? "Ver comprovante" :"Retornar",
                        action: () => {
                            if ("receiptId" in paymentData) {
                                if (payment.data().checkoutWithoutRegister) {
                                    //setLocation(`/comprovante/${paymentData.receiptId}`);
                                    return;
                                }
                                //setLocation("/pagamentos");
                                return;
                            }
                            //setLocation( "/pagamentos")
                        },
                    },
                ]);
        const transaction: any = await createPayment(
            await creator.registeredPayment.transaction(i, paymentData, cardAtom || card, zoopId),
            source.token,
        );
        try {
            //if (cartCollectionRef && paymentData.cartId) await cartCollectionRef.doc(paymentData.cartId).update({ status: "paid" });
            const receivables = paymentData.insurance ? undefined : await getReceivables(transaction.id, source.token);
            const [dbData, sheetData, receivablesData] = creator.registeredPayment.dbAndSheet(
                transaction,
                paymentData,
                zoopId,
                receivables,
                timestamp,
            );
            await writeTransactionToSheet(sheetData);
            if (!paymentData.insurance && receivablesData.length > 0) await writeReceivablesToSheet(receivablesData);
            await payment.ref.update(dbData).catch(errorThrowers.saveFirestore("registered-payment"));
           // if (userData && userData.status !== "paid") catalogUserDataDoc.ref.update({ status: "paid" });
            onSuccessRef.current(dbData as any);
        } catch (error) {
            Sentry.captureException(error);
        }
        let message = payMessages.prompt.PAYMENT_SUCCESS;
        if (paymentData.insurance) {
            message = message
                .set("title", "Pagamento pré-autorizado")
                .set("userDescription", "O pagamento será aprovado em instantes.")
                .set("userResolution", paymentSuccessUserResolution(paymentData.seller))
                .withButtons([
                    {
                        title: "ver pagamentos",
                        action: () => {
                            //setLocation( "/pagamentos");
                        },
                    },
                ]);
        } else {
            if (zoopId) {
                message = message
                    .set("userDescription", "O pagamento foi concluído.")
                    .set("userResolution", paymentSuccessUserResolution(paymentData.seller))
                    .withButtons([
                        {
                            title: "ver pagamentos",
                            action: () => {
                                //setLocation( "/pagamentos");
                            },
                        },
                    ]);
            } else {
                message = message
                    .set("userDescription", "O pagamento foi concluído.")
                    .set("userResolution", paymentSuccessUserResolution(paymentData.seller))
                    .withButtons([
                        {
                            title: "ver comprovante",
                            action: () => {
                                //setLocation(`/comprovante/${transaction.sales_receipt}`);
                            },
                        },
                    ]);
            }
        }
        return message;
    });
    useAsyncEffect(async () => {
        if (state.status === "failed") {
            /*const [values, dbData] = creator.errorRegisteredData(state.error as any, supplierId);
            await sheet(process.env.SHEET_ID_TRANSACTIONS).write({ values, range: "Transacoes_Erros!A1" });
            await errorsCollection.add(dbData);*/
        }
    }, [state]);
    console.log('[cbk,state]',[cbk,state])
    return [cbk, state];
}

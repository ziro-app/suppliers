import { ZiroPromptMessage } from "ziro-messages";

export const FailureMessage = (msg) =>{
    return new ZiroPromptMessage({
        name: "failTest",
        type: "destructive",
        code: "6767676767",
        title: "Ocorreu um erro!",
        userDescription: msg,
        userResolution: "Tente novamente ou contate suporte.",
        internalDescription: "prompt de falha",
        illustration: "errorLoading",
        additionalData: undefined,
    });
}
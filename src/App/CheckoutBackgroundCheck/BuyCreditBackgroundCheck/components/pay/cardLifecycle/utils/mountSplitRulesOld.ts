import { CreditCardPayments } from "../../../../utils/firebase/credit-card-payments";
import { UnregisteredTransaction } from "../../Zoop";

interface generic {
    amount: string | number;
    percentage: string | number;
}

const filter = (a: generic) => (b: generic) => a?.amount == b?.amount && a?.percentage == b?.percentage;

// @ts-ignore
const mountSplitRulesOld = (
    split_rules: UnregisteredTransaction.Response["split_rules"], // @ts-ignore
    { antiFraud, markup }: CreditCardPayments.SellerZoopPlan,
) => {
    const filteredSplitAntifrad = split_rules?.filter(filter(antiFraud))[0] || { percentage: 0, amount: 0 };
    const filteredSplitMarkup = split_rules?.filter(filter(markup))[0] || { percentage: 0, amount: 0 };
    return [filteredSplitAntifrad, filteredSplitMarkup] as [typeof filteredSplitAntifrad, typeof filteredSplitMarkup];
};

export default mountSplitRulesOld;

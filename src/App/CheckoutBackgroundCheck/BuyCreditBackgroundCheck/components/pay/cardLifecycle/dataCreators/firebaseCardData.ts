import { UnregisteredTransaction } from "../../Zoop";
import { FirebaseCard } from "../../../../utils/firebase/catalog-user-data";
import type firebase from "firebase";
export default (timestamp: () => firebase.firestore.FieldValue, transaction?: UnregisteredTransaction.Response) =>
    transaction
        ? ({
              status: "pendingDocument",
              antifraudTransaction: transaction.amount.replace(".", ""),
              added: timestamp() as any,
              updated: timestamp() as any,
          } as FirebaseCard.Generic)
        : ({
              status: "pendingDocument",
              added: timestamp() as any,
              updated: timestamp() as any,
          } as FirebaseCard.Generic);

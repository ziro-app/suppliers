import { auth, db } from "@bit/ziro.firebase.init"
import { deleteAuthUser } from "./deleteAuthUser"
import { reauthenticate } from "./reauthenticate"
import { requestZoop } from "./requestZoop"
import { DeleteAccount } from "../types"

export async function deleteAccount(data: DeleteAccount) {
  const email = auth.currentUser?.email || ""
  const { password, collectionRef, zoopId, zoopUrl } = data
  await reauthenticate({ email, password })
  /** delete from zoop if necessary */
  if (zoopId && zoopUrl) await requestZoop({ id: zoopId, url: zoopUrl }, 4)
  /** delete from firebase users collection */
  const userCollection = await db.collection("users").where("email", "==", email).get()
  const userRef = userCollection.docs[0].ref
  await userRef.delete()
  /** delete from firebase main data collection for that type of user */
  const userDataCollection = await collectionRef.where("email", "==", email).get()
  const userDataCollectionRef = userDataCollection.docs[0].ref
  await userDataCollectionRef.delete()
  /** delete from firebase auth */
  if (auth.currentUser?.uid) await deleteAuthUser(auth.currentUser.uid)
}

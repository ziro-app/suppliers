import { auth, db } from "@bit/ziro.firebase.init"
import { reauthenticate } from "./reauthenticate"
import { requestSheet } from "./requestSheet"
import { updateAuthUser } from "./updateAuthUser"
import { resendConfirmEmail } from "./resendConfirmEmail"
import { ChangeEmail, ConfirmLinkReq, SheetData } from "../types"

export async function changeEmail(data: ChangeEmail) {
  const uid = auth.currentUser?.uid || ""
  const oldEmail = auth.currentUser?.email || ""
  const { newEmail, password, collectionRef, continueUrl, sheetRange, sheetId } = data
  const newEmailLower = newEmail.toLowerCase()
  await reauthenticate({ email: oldEmail, password })
  /** update at firebase auth */
  const updateData = {
    uid,
    prop: {
      email: newEmailLower,
      emailVerified: false,
    },
  }
  const { ok } = await updateAuthUser(updateData)
  if (!ok) throw new Error("updateAuthUser: Erro ao atualizar email do usuário")
  /** update at firebase users collection */
  const userCollection = await db.collection("users").where("email", "==", oldEmail).get()
  const userRef = userCollection.docs[0].ref
  await userRef.update({ email: newEmailLower })
  /** update at firebase main data collection for that type of user */
  const userDataCollection = await collectionRef.where("email", "==", oldEmail).get()
  const userDataCollectionRef = userDataCollection.docs[0].ref
  await userDataCollectionRef.update({ email: newEmailLower })
  /** resend confirm email */
  const resendConfirmEmailData: ConfirmLinkReq = {
    type: "Email",
    email: newEmailLower,
    continueUrl,
  }
  await resendConfirmEmail(resendConfirmEmailData)
  /** update sheets if necessary */
  if (sheetRange && sheetId) {
    const requestSheetData: SheetData = {
      apiResource: "values",
      apiMethod: "update",
      range: sheetRange,
      resource: { values: [[newEmail]] },
      spreadsheetId: sheetId,
      valueInputOption: "raw",
    }
    await requestSheet(requestSheetData)
  }
}

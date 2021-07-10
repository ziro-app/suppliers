import { auth, db } from "@bit/ziro.firebase.init"
import { ResetPassword } from "../types"

export async function resetPassword(data: ResetPassword) {
  const { email } = data
  const userCollection = await db.collection("users").where("email", "==", email).get()
  if (userCollection.empty) throw new Error("Email não cadastrado")
  await auth.sendPasswordResetEmail(email)
}

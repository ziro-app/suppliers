import { auth } from "@bit/ziro.firebase.init"
import { reauthenticate } from "./reauthenticate"
import { UpdatePassword } from "../types"

export async function changePassword(data: UpdatePassword) {
  const user = auth.currentUser
  const { oldPassword, newPassword } = data
  await reauthenticate({ email: user?.email || "", password: oldPassword })
  await user?.updatePassword(newPassword)
}

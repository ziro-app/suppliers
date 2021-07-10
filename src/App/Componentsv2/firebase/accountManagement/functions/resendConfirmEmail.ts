import { ConfirmLinkReq, SendEmail } from "../types"
import { generateConfirmLink } from "./generateConfirmLink"
import { sendEmail } from "./sendEmail"

export async function resendConfirmEmail(data: ConfirmLinkReq) {
  const { ok, link } = await generateConfirmLink(data)
  if (ok) throw new Error("Email já validado!")
  const emailData: SendEmail = {
    to: data.email as string,
    customEmail: false,
    confirmEmail: { link },
  }
  return sendEmail(emailData)
}

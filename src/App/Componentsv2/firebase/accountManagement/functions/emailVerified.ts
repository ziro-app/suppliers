import { customAxios } from "@bit/ziro.utils.use-http"

export async function emailVerified(email: string) {
  const {
    data: { ok },
  } = await customAxios.request({
    url: "https://us-east1-ziro-app-data.cloudfunctions.net/checkEmail",
    method: "POST",
    headers: {
      Authorization: `${process.env.FIREBASE_AUTH_TOKEN}`,
    },
    data: { email },
  })
  return ok
}

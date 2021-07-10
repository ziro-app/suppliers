import { db } from "@bit/ziro.firebase.init"

const getActivePlan = async uid => {
  const request = await db.collection("suppliers").doc(uid).get()
  const result = request.data()

  return result.sellerZoopPlan.activePlan
}

export default getActivePlan

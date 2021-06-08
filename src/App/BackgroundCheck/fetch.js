import { db } from "../../Firebase/index"

const fetch = (setIsLoading, setErrorLoading, docId, isCollaborator, ownerId, { setFreeRequests }) => {
  const run = async () => {
    try {
      const refId = isCollaborator ? ownerId : docId
      const doc = await db.collection("suppliers").doc(refId).get()
      let reqFree = 0
      if (doc.exists) {
        const { backgroundCheckRequestsAvailable } = doc.data()
        reqFree = backgroundCheckRequestsAvailable
      }
      setFreeRequests(reqFree)
      setIsLoading(false)
      setErrorLoading(false)
    } catch (error) {
      console.log(error)
      setErrorLoading(true)
      setIsLoading(false)
    }
  }
  run()
}

export default fetch

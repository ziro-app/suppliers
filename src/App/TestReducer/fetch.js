import axios from 'axios'
import { db } from '../../Firebase/index'

const fetch = (state) => {
    const {setIsError, setIsLoading, setLinks} = state
    const query = db.collection('credit-card-payments-test').where('seller', '==', 'Lojas Marisa')
    const source = axios.CancelToken.source()
    const run = async () => {
        try {
            query.onSnapshot(
                async snapShot => {
                    setIsLoading(true)
                    const links = []
                    if (!snapShot.empty) {
                        snapShot.forEach((doc) => {
                            links.push({data:doc.data(), id: doc.id})
                        })
                    }
                    setLinks(links[0])
                    console.log(links[0])
                    setIsLoading(false)
                })
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch
import axios from 'axios'
import { db } from '../../Firebase/index'

const fetch = (state) => {
    const {setIsError, setIsLoading, setSupplier} = state
    const query = db.collection('suppliers').where('fantasia', '==', 'LOJAS MARISA')
    const source = axios.CancelToken.source()
    const run = async () => {
        try {
            query.onSnapshot(
                async snapShot => {
                    setIsLoading(true)
                    const supplier = []
                    if (!snapShot.empty) {
                        snapShot.forEach((doc) => {
                            supplier.push(doc.data())
                        })
                    }
                    setSupplier(supplier[0])
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
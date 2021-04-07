
import { db } from "../../../../Firebase";
export async function fetch(brandName,setLoading, setError, setMessage, setProductsData) {
    const query = db
        .collection("catalog-images")
        .where("brandName", "==", brandName)
        .orderBy("timestamp", "desc")
        .limit(1000);
    await query.onSnapshot((snapshot) =>{
        const productsArray = []
        snapshot.forEach(doc => {
            const {id:productId} = doc
            productsArray.push({...doc.data(), productId})
        })
        setProductsData(productsArray)
    })
}

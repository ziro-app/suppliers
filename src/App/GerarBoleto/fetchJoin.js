const fetch = (state) => {
    const { finishPayments,finishPending, pendingBoletos, paymentBoletos, paymentDuplicatas, pendingDuplicatas, setfisrtTicket, setTicket, setIsLoading, setIsError} = state
    const run = () => {
        try {
            if(finishPayments && finishPending){
                if(pendingBoletos[0] || paymentBoletos[0]){
                    const ordenar = (a,b) => {
                        if(a.contador>b.contador) return -1
                        if(a.contador<b.contador) return 1
                    }
                    const orderFetch = paymentBoletos.sort((a,b) => ordenar(a,b))
                    const orderBillet = paymentDuplicatas.sort((a,b) => ordenar(a,b))
                    if(!pendingBoletos[0]){
                        setfisrtTicket([...orderFetch])
                        setTicket([...orderBillet])    
                    }else{
                        setfisrtTicket([...pendingBoletos,...orderFetch])
                        setTicket([...pendingDuplicatas,...orderBillet])
                    }
                }
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            setIsError(true)
        }
    }
    run()
}

export default fetch
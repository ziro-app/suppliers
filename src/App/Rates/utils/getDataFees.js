import sumTextNumbers from './sumTextNumbers'

const arrayDatas = (dataPlan, brands, activePlan) => {
    const { ziroAntifraudFee ,ziroMarkupFee, zoopFee } = dataPlan
    return brands.map(brand => {
        const filteredAntifraud = ziroAntifraudFee[brand]
        const filteredMarkup = ziroMarkupFee[brand]
        const filteredZoop = zoopFee[brand]
        const dataFees = []
        for(let i = 0; i <= 12; i++){
            const fullNameFluxo = {
                0: 'débito',
                1: 'à vista',
                2: '2x a 6x',
                7: '7x a 12x'
            }
            const fullNameNormal = {
                0: 'débito',
                1: 'à vista'
            }
            const conditionalFluxo = i === 0 || i === 1 ||  i === 2 || i === 7
            const conditionalAntecipado = true
            const isFluxo = activePlan === 'standard'
            const feeSeg = sumTextNumbers([
                filteredMarkup[`installment${i}`],
                filteredAntifraud[`installment${i}`],
                filteredZoop[`installment${i}`]
            ])
            const fee = sumTextNumbers([
                filteredMarkup[`installment${i}`],
                filteredZoop[`installment${i}`]
            ])
            if(isFluxo ? conditionalFluxo : conditionalAntecipado)
            dataFees.push([
                isFluxo
                ? fullNameFluxo[i]
                : fullNameNormal[i] || `${i}x` ,
                fee,
                feeSeg,
            ])
        }
        return {
            content:dataFees,
            brand
        }
    })
}

export default arrayDatas

const planName = (plan) => {
    if(plan === 'standard'){
        return {
            name: 'Fluxo',
            description: 'Seguindo as parcelas'
        }
    }
    if(plan.includes('30')){
        return {
            name: 'Antecipado D+30',
            description: 'Tudo em 30 dias'
        }
    }
    if(plan.includes('14')){
        return {
            name: 'Antecipado D+14',
            description: 'Tudo em 14 dias'
        }
    }
}

export default planName

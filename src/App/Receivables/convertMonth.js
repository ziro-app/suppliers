const convertMonth = (data) => {
    const arrayData = data.split('/')
    const [dia, mes, ano] = arrayData
    const changeMes = (mes) => {
        if(mes === 'Jan') return 1
        if(mes === 'Feb') return 2
        if(mes === 'Mar') return 3
        if(mes === 'Apr') return 4
        if(mes === 'May') return 5
        if(mes === 'Jun') return 6
        if(mes === 'Jul') return 7
        if(mes === 'Aug') return 8
        if(mes === 'Sep') return 9
        if(mes === 'Oct') return 10
        if(mes === 'Nov') return 11
        if(mes === 'Dec') return 12
        return mes
    }
    return new Date(ano, changeMes(mes), dia)
}

export default convertMonth
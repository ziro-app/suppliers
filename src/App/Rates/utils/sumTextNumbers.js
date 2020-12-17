const sumTextNumbers = (arrayTextNumbers) => {
    const arrayNumber = arrayTextNumbers.map(numText => {
        return Number(numText)
    })
    const sumElements = arrayNumber.reduce((a, b) => a + b, 0)
    const roundSum = (Math.round(sumElements*100))/100
    const transformToPorcentText = (num) => {
        if(num === 0){
            return '0,00%'
        }
        return `${String(num).replace('.',',')}%`
    }
    return transformToPorcentText(roundSum)
}

export default sumTextNumbers
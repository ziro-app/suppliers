import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index'

export const removeDuplicates = arrayWithDuplicates => {
	if (!arrayWithDuplicates) throw new Error('function removeDuplicates must receive an array')
	if (!(arrayWithDuplicates instanceof Array)) throw new Error('function removeDuplicates must receive an array')
	return arrayWithDuplicates.flat().reduce((accumulated, current) => {
		if (accumulated.includes(current)) return accumulated
		return [...accumulated, current]
	}, [])
}

export const toMMMYYY = (date) => {
    if(date){
        const [month, fullYear] = date.split('/')
        const MMToMMM = {
            '1': 'JAN',
            '2': 'FEV',
            '3': 'MAR',
            '4': 'ABR',
            '5': 'MAI',
            '6': 'JUN',
            '7': 'JUL',
            '8': 'AGO',
            '9': 'SET',
            '10': 'OUT',
            '11': 'NOV',
            '12': 'DEZ',
        }
        const newMonth = MMToMMM[month]
        return `${newMonth}/${fullYear[2]}${fullYear[3]}`
    }
    return null
}

export const toMMYYYY = (date) => {
    if(date){
        const [month, fullYear] = date.split('/')
        const MMMToMM = {
            'JAN': '1',
            'FEV': '2',
            'MAR': '3',
            'ABR': '4',
            'MAI': '5',
            'JUN': '6',
            'JUL': '7',
            'AGO': '8',
            'SET': '9',
            'OUT': '10',
            'NOV': '11',
            'DEZ': '12',
        }
        const newMonth = MMMToMM[month]
        return `${newMonth}/20${fullYear}`
    }
    return null
}

export const getMonthFullYear = (data) => {
    return [data.getMonth() + 1, data.getFullYear()];
  };

  export const getListMonth = (dataEntrada) => {
    const result = [];
    const [monthEntrada, yearEntrada] = getMonthFullYear(dataEntrada);
    const nowMonth = new Date().getMonth() + 1;
    const nowYear = new Date().getFullYear();
    for (let year = yearEntrada; year <= nowYear; year++) {
      if (year === nowYear) {
        if (yearEntrada === nowYear) {
          for (let month = monthEntrada; month <= nowMonth; month++) {
            result.push(`${month}/${year}`);
          }
        } else {
          for (let month = 1; month <= nowMonth; month++) {
            result.push(`${month}/${year}`);
          }
        }
      } else if (yearEntrada === nowYear) {
        for (let month = 1; month <= monthEntrada; month++) {
          result.push(`${month}/${year}`);
        }
      } else if (yearEntrada !== year) {
        for (let month = 1; month <= 12; month++) {
          result.push(`${month}/${year}`);
        }
      } else {
        for (let month = monthEntrada; month <= 12; month++) {
          result.push(`${month}/${year}`);
        }
      }
    }
    return result.map((date) => toMMMYYY(date)).reverse()
  };

export const getRangeMonth = (date) => {
    const [mes, ano] = date.split('/')
    return [new Date(ano, mes-1, 1), new Date(ano, mes, 0, 23, 59, 59)]
}

function filterName({storageFilterClient, storageFilterStatus, storageFilterMonth}){
    if(storageFilterClient && storageFilterStatus && storageFilterMonth) return 'allFilters'
    if(!storageFilterClient && !storageFilterStatus && storageFilterMonth) return 'month'
    if(!storageFilterClient && storageFilterStatus && !storageFilterMonth) return 'status'
    if(storageFilterClient && !storageFilterStatus && !storageFilterMonth) return 'client'
    if(!storageFilterClient && storageFilterStatus && storageFilterMonth) return 'month and status'
    if(storageFilterClient && !storageFilterStatus && storageFilterMonth) return 'month and client'
    if(storageFilterClient && storageFilterStatus && !storageFilterMonth) return 'status and client'
    return ''
}

export function getFilterQuery({storageFilterClient, storageFilterStatus, storageFilterMonth}) {
    const newFilterMonth = storageFilterMonth ? toMMYYYY(storageFilterMonth.toUpperCase()) : 'null'
    const [dataInicio, dataFim] = newFilterMonth ? getRangeMonth(newFilterMonth) : [null, null]
    const type = filterName({storageFilterClient, storageFilterStatus, storageFilterMonth})
        switch (type) {
            case 'allFilters':
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
                .where('buyerRazao', '==', `${storageFilterClient}`)
                .where('status', '==', `${storageFilterStatus}`)
                .where('dateLastUpdate', '>=', dataInicio)
                .where('dateLastUpdate', '<=', dataFim)
            case 'month':
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
                .where('dateLastUpdate', '>=', dataInicio)
                .where('dateLastUpdate', '<=', dataFim)
            case 'status':
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
                .where('status', '==', `${storageFilterStatus}`)
            case 'client':
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
                .where('buyerRazao', '==', `${storageFilterClient}`)
            case 'month and status':
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
                .where('status', '==', `${storageFilterStatus}`)
                .where('dateLastUpdate', '>=', dataInicio)
                .where('dateLastUpdate', '<=', dataFim)
            case 'month and client':
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
                .where('buyerRazao', '==', `${storageFilterClient}`)
                .where('dateLastUpdate', '>=', dataInicio)
                .where('dateLastUpdate', '<=', dataFim)
            case 'status and client':
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
                .where('buyerRazao', '==', `${storageFilterClient}`)
                .where('status', '==', `${storageFilterStatus}`)
            default:
                return db
                .collection('credit-card-payments')
                .orderBy('dateLastUpdate', 'desc')
            }
        }

export const round = (num, places) => {
    if (!(`${  num}`).includes("e")) {
        return +(`${Math.round(`${num  }e+${  places}`)  }e-${  places}`);
    } 
        const arr = (`${  num}`).split("e");
        let sig = ""
        if (+arr[1] + places > 0) {
            sig = "+";
        }
        return +(`${Math.round(`${+arr[0]  }e${  sig  }${+arr[1] + places}`)  }e-${  places}`);
    
},

    dateFormat = (date) => {
        if (date) {
            return new Date(date.seconds * 1000)
                .toLocaleDateString('pt-br', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })
                .replace(' de ', '/');
        } return '-';
    },

    parcelFormat = (number) => {
        if (number === 0) return '0,00';
        if (number > 0 && number < 1) return (`${  number}`).replace('.', ',');
        const numSplit = (`${  number}`).split('.');
        if (numSplit.length === 1) return `${number},00`;
        const num = numSplit[1].length === 1 ? `${number}0` : `${number}`
        const formatted = currencyFormat((num).replace('.', ''));
        return formatted.replace('R$', '').includes(',') ? formatted.replace('R$', '') : `${formatted.replace('R$', '')},00`;
    },

    stringToFloat = (str) => parseFloat(str.replace(/[R$\.,]/g, '')) / 100,
    internalFormat = value => {
        if (value) {
            const valueString = `${value}`
            if (valueString.match(/^0[0-9]{0,1}$|^[1-9]([0-9]?)+$/g)) {
                const noFormat = (parseInt(value, 10) / 100).toFixed(2)
                if (noFormat.length <= '6')
                    return `R$${noFormat.replace('.', ',')}`
                
                    const [integer, decimal] = noFormat.split('.')
                    const indexToSlice = integer.length - 3
                    const format = [integer.slice(0, indexToSlice), integer.slice(indexToSlice)].join('.')
                    return `R$${[format, decimal].join(',')}`
                
            } 
                const noFormat = `${round(value, 2)}`
                if (noFormat.length <= '7')
                    return `R$${noFormat.replace('.', ',')}`
                
                    const [integer, decimal] = noFormat.split('.')
                    const indexToSlice = integer.length - 3
                    const format = [integer.slice(0, indexToSlice), integer.slice(indexToSlice)].join('.')
                    return `R$${[format, decimal].join(',')}`
                
            
        }
        return ''
    }
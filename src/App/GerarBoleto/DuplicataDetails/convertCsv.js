import objectToArray from '@ziro/object-array'
import currencyFormat from '@ziro/currency-format';
import { formatDateUTC3 } from '@ziro/format-date-utc3'
import convertMoth from './convertMonth'

const dowloadCsv = (data, title) => {
    const dataChange = []
    data.map(obj => {
        const {boleto, comissao, lojista, receita, romaneio, valor, vencimento, venda} = obj
         dataChange.push({
            boleto: boleto || '-',
            romaneio: romaneio || '-',
            lojista: lojista || '-',
            venda: formatDateUTC3(convertMoth(venda || data_venda)).split(' ')[0] || '-',
            vencimento: formatDateUTC3(convertMoth(vencimento)).split(' ')[0] || '-',
            valor: currencyFormat(Math.round(valor*100*100)/100).replace('R$','') || '-',
            comissao: `${String(comissao*100).replace('.',',')}%` || '-',
            receita: currencyFormat(Math.round(receita*100*100)/100).replace('R$','') || '-'
            })
    })
    const csvRow = []
    const arrayData = objectToArray([dataChange])
    arrayData.map(item => csvRow.push(item.join(';')))
    const csvFile = csvRow.join('\n')
    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, title);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            const encodedUri = encodeURI(url);
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", title);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export default dowloadCsv

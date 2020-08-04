import objectToArray from '@ziro/object-array';
import currencyFormat from '@ziro/currency-format';

const dowloadCsv = (data, totalAmount, totalTransactions, title) => {
    const dataChange = []
    data.map(obj => {
        const { charge, completeDate, items } = obj
        dataChange.push({
            Data: completeDate || '-',
            Valor: charge.replace('R$', '') || '-',
            QntdVendas: items.length || '-'
        })
    });
    const csvRow = []
    const arrayData = objectToArray([dataChange]);
    arrayData.map(item => csvRow.push(item.join(';')));
    csvRow.push(';;;');
    csvRow.push(`Total;${currencyFormat(totalAmount.toFixed(2).replace('.', '')).replace('R$', '')};${totalTransactions};`);
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

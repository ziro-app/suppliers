import objectToArray from '@ziro/object-array';
import { formatCurrency } from '../utils/formatCurrency';

const dowloadCsv = (data, title) => {
    if (data && data.length > 0) {
        const dataChange = []
        data.map(obj => {
            const { transactionZoopId, datePaid, buyerRazao, charge, installments, cardFirstFour, cardLastFour, recAmount, recInstallment, recDate } = obj

            dataChange.push({
                "ID da Transação": transactionZoopId || '-',
                "Data": recDate.substring(0, recDate.indexOf(' ')) || '-',
                "Valor": formatCurrency(recAmount) || '-',
                "Parcela": recInstallment || '-',
                "Lojista": buyerRazao || '-',
                "Valor Total da Transação": formatCurrency(charge) || '-',
                "Total de Parcelas": installments || '-',
                "Cartão": (cardFirstFour + '...' + cardLastFour) || '-',
                "Data Venda": datePaid.substring(0, datePaid.indexOf(' ')) || '-',
            })
        });
        const csvRow = []
        const arrayData = objectToArray([dataChange]);
        arrayData.map(item => csvRow.push(item.join(';')));
        csvRow.push(';;;');
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
}

export default dowloadCsv

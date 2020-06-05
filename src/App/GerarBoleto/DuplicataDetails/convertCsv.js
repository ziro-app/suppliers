import objectToArray from '@ziro/object-array'

const dowloadCsv = (data, title) => {
    let csvRow = []
    const arrayData = objectToArray([data])
    arrayData.map(item => csvRow.push(item.join(';')))
    const csvFile = csvRow.join('\n')
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, title);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", title);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export default dowloadCsv

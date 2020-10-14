const invalidCpfs = [
    '',
    '000.000.000-00',
    '111.111.111-11',
    '222.222.222-22',
    '333.333.333-33',
    '444.444.444-44',
    '555.555.555-55',
    '666.666.666-66',
    '777.777.777-77',
    '888.888.888-88',
    '999.999.999-99'
];

const invalidCnpjs = [
    '',
    '00.000.000/0000-00',
    '11.111.111/1111-11',
    '22.222.222/2222-22',
    '33.333.333/3333-33',
    '44.444.444/4444-44',
    '55.555.555/5555-55',
    '66.666.666/6666-66',
    '77.777.777/7777-77',
    '88.888.888/8888-88',
    '99.999.999/9999-99'
];

const reducer = (accumulator, currentValue) => accumulator + currentValue;

function validadeCpf(cpf) {
    if (invalidCpfs.includes(cpf)) return false;
    let parts = cpf.split('-');
    let numbers = parts[0].replace(/\./g, '').split('');
    const calcFirtsNumber = 11 - (numbers.map((num, index) => parseInt(num) * (10 - index)).reduce((a, b) => reducer(a, b)) % 11);
    const first = (calcFirtsNumber >= 10) ? 0 : calcFirtsNumber;
    numbers.push(`${first}`);
    const calcSecondNumber = 11 - (numbers.map((num, index) => parseInt(num) * (11 - index)).reduce((a, b) => reducer(a, b)) % 11);
    const second = (calcSecondNumber >= 10) ? 0 : calcSecondNumber;
    return parseInt(parts[1]) === parseInt(`${first}${second}`);
}

function validadeCnpj(cnpj) {
    if (invalidCnpjs.includes(cnpj)) return false;
    let parts = cnpj.split('-');
    let numbers = parts[0].replace(/(\.)|(\/)/g, '').split('').reverse();
    const mult = [2, 3, 4, 5, 6, 7, 8, 9];
    const calcFirtsNumber = 11 - (numbers.map((num, index) => index >= 8 ? parseInt(num) * mult[index % 8] : parseInt(num) * mult[index]).reduce((a, b) => reducer(a, b)) % 11);
    const first = (calcFirtsNumber >= 10) ? 0 : calcFirtsNumber;
    numbers.splice(0, 0, `${first}`);
    const calcSecondNumber = 11 - (numbers.map((num, index) => index >= 8 ? parseInt(num) * mult[index % 8] : parseInt(num) * mult[index]).reduce((a, b) => reducer(a, b)) % 11);
    const second = (calcSecondNumber >= 10) ? 0 : calcSecondNumber;
    return parseInt(parts[1]) === parseInt(`${first}${second}`);
}

export default function validateDocuments(document) {
    if (document.length === 14) return validadeCpf(document);
    return validadeCnpj(document);
}

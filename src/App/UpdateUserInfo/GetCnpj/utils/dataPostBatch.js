const rowPosition = (arrayObj, param, valor) => {
    const arrayPosition = arrayObj.map((item, index) => {
      if (item[param] === valor) return index;
      return "";
    });
    return Number(arrayPosition.join("")) + 2;
  };
  
const alfabetoNumber = number => {
    return (number + 9).toString(36).toUpperCase();
  };
  
const columnPosition = (obj, parm) => {
    const number = Object.keys(obj).indexOf(parm) + 1;
    return alfabetoNumber(number);
  };
  
const updateSheet = (arrayObj, parm, valor, updateObj, aba) => {
    const posicaoRow = rowPosition(arrayObj, parm, valor);
    const obj = arrayObj[posicaoRow - 2];
    const objetoUpdateSheet = Object.keys(updateObj).map((item, index) => {
      const posicaoColuna = columnPosition(obj, item);
      return {
        range: `${aba}!${posicaoColuna}${posicaoRow}`,
        values: [[Object.values(updateObj)[index]]]
      };
    });
    return objetoUpdateSheet;
  };
  
module.exports = updateSheet
  
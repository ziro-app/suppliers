export const functionSort = (a, b) => {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};
export const functionSortDate = (a, b) => {
    const { data } = a;
    const partsA = data.split('/')
    const formattedA = partsA.length === 3 ? new Date(`${partsA[1]}/${partsA[0]}/${partsA[2]}`) : null;
    const { data: dataB } = b;
    const partsB = dataB.split('/')
    const formattedB = partsB.length === 3 ? new Date(`${partsB[1]}/${partsB[0]}/${partsB[2]}`) : null;
    if ((formattedA && !formattedB) || formattedA > formattedB) {
        return 1;
    }
    if ((!formattedA && formattedB) || formattedB > formattedA) {
        return -1;
    }
    return 0;
};

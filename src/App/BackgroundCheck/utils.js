export const dateFormat = (date) => {
    if (date && date.seconds) {
        return new Date(date.seconds * 1000);
    } else return '-';
}

export const compareDates = (one, two) => {
    return one.getMonth() === two.getMonth() && one.getFullYear() === two.getFullYear();
}

export const formatDate = date => `${date.getFullYear()}-${date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()}`;

export const getFinalDate = (today, days) => {
    let newDate = new Date(today);
    newDate.setDate(today.getDate() + days);
    return newDate;
};

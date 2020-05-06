export const custom = (fontSize, color) => ({
    display: 'grid',
    justifyItems: 'center',
    fontSize: `${(fontSize + 2) / 10}rem`,
    fontWeight: '500',
    color: color
});
export const illustrationContainer = {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridRowGap: '20px',
    alignContent: 'start',
    justifyItems: 'center'
}
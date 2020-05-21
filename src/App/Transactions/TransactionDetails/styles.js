import { fontTitle, fontSizeSmall } from '@ziro/theme';

export const custom = (fontSize, color) => ({
    display: 'grid',
    justifyItems: 'center',
    fontSize: `${(fontSize + 2) / 10}rem`,
    fontWeight: '500',
    color: color
}),
    illustrationContainer = {
        display: 'grid',
        gridTemplateRows: '1fr',
        gridRowGap: '20px',
        alignContent: 'start',
        justifyItems: 'center'
    },
    buttonContainer = {
        display: 'grid',
        gridRowGap: '20px',
        marginTop: '-30px'
    },
    modalContainer = {
        zIndex: '999',
        maxWidth: '350px',
        width: '90%',
        margin: '0 auto',
        padding: '30px',
        boxSizing: 'border-box',
        textAlign: 'center',
        borderRadius: '3px',
        background: 'white',
        boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10),
1px 0px 8px 0px rgba(34,34,34,0.05)`
    },
    modalLabel = {
        display: 'flex',
        justifyContent: 'center',
        fontFamily: fontTitle,
        fontSize: '1.4rem',
        textTransform: 'uppercase'
    },
    spinner = {
        display: 'grid',
        justifyItems: 'center'
    }
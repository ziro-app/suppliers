import { fontTitle, gradient } from '@ziro/theme';

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
        gridTemplateColumns: '1fr',
        width: '50%',
        marginLeft: 'auto'
    },
    button = {
        display: 'block',
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        MozAppearance: 'none',
        outline: 'none',
        cursor: 'pointer',
        width: '100%',
        padding: '8px 0px',
        border: 'none',
        borderRadius: '20px',
        fontFamily: fontTitle,
        fontSize: '1.2rem',
        color: '#FFF',
        textAlign: 'center',
        background: gradient,
        boxShadow: `0px 3px 12px -3px rgba(34,34,34,0.65)`
    }
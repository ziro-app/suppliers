import { fontTitle, gradient, shadow } from '@ziro/theme';

export const
    spinner = {
        display: 'grid',
        justifyItems: 'center'
    },
    btn = {
        display: 'block', // necessary for link version
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        MozAppearance: 'none',
        outline: 'none',
        cursor: 'pointer',
        maxWidth: '400px',
        width: '100%',
        margin: '0 auto',
        padding: '8px 0px',
        border: 'none',
        borderRadius: '20px',
        fontFamily: fontTitle,
        fontSize: '1.4rem',
        color: '#FFF',
        textAlign: 'center',
        background: gradient,
        boxShadow: `${shadow}`
    }

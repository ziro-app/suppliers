import { gradient, fontTitle, primaryColor, shadow } from '@ziro/theme';

export const

    spinner = {
        display: 'grid',
        justifyItems: 'center'
    },
    info = {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gridColumnGap: '10px',
        textAlign: 'end',
    },
    titleStyle = {
        maxWidth: '500px',
        fontFamily: fontTitle,
        fontSize: '1.5rem',
        textAlign: 'start',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    contentStyle = {
        maxWidth: '500px',
        fontSize: '1.5rem',
        fontWeight: '400',
        color: primaryColor,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    cellStyle = {
        maxWidth: '130px',
        width: '100%',
        height: '100%',
        fontSize: '1.4rem',
        textAlign: 'center',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        cursor: 'pointer'
    },
    customGrid = {
        gridTemplateColumns: 'auto 1fr 1fr 10px',
        gridRowGap: '15px'
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

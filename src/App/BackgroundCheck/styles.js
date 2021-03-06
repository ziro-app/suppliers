import { alertColor, fontTitle, primaryColor, containerWithPadding } from '@ziro/theme';

export const wrapper = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridAutoRows: '100px',
    boxSizing: 'border-box',
    marginTop: '-25px'
},
    box1 = {
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 1,
        gridRowEnd: 3
    },
    box2 = {
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 2,
        gridRowEnd: 2,
        marginTop: '55px',
        height: '400px'
    },
    details = {
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '15px',
        fontWeight: 'bold'
    },
    apiErrorContainer = {
        display: 'grid',
        alignContent: 'start',
        gridRowGap: '15px',
        color: primaryColor,
        textAlign: 'center',
        ...containerWithPadding
    },
    header = {
        fontFamily: fontTitle,
        textTransform: 'uppercase',
        color: alertColor
    },
    tooltipContainer = {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr'
    },
    tooltipCursor = {
        cursor: 'pointer'
    },
    consultasContainer = {
        display: 'grid',
        rowGap: '35px',
        marginTop: '35px',
        marginBottom: '50px'
    },
    saldosLabel = {
        opacity: '55%',
        fontSize: '1.1rem'
    },
    valorH1 = {
    textAlign: 'center',
    fontSize: '1.8rem',
    margin: '0',
    }

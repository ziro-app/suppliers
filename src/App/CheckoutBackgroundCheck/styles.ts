import { alertColor, fontTitle, primaryColor, containerWithPadding } from '@ziro/theme';

export const wrapper = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoRows: '100px',
        boxSizing: 'border-box',
        marginTop: '-25px',
    },
    box1 = {
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 1,
        gridRowEnd: 3,
    },
    box2 = {
        gridColumnStart: 1,
        gridColumnEnd: 4,
        gridRowStart: 2,
        gridRowEnd: 2,
        marginTop: '55px',
        height: '400px',
    },
    details = {
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '15px',
        fontWeight: 'bold',
    },
    apiErrorContainer = {
        display: 'grid',
        alignContent: 'start',
        gridRowGap: '15px',
        color: primaryColor,
        textAlign: 'center',
        ...containerWithPadding,
    },
    header = {
        fontFamily: fontTitle,
        color: alertColor,
    },
    tooltipContainer = {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
    },
    tooltipCursor = {
        cursor: 'pointer',
    };

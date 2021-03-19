import { fontTitle } from '@ziro/theme';

export const container = {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        boxSizing: 'border-box',
        width: '100%',
        padding: '15px 10px'
    },
    checkboxContainer = {
        display: 'grid',
        gridTemplateColumns: '1fr 4fr',
        gridGap: '5px',
        alignItems: 'center',
        justifyItems: 'left',
    },
    buttonsDuplicateRemoveContainer = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '10px',
        alignItems: 'center',
        justifyItems: 'center',
    },
    caption = {
        position: 'relative',
        fontFamily: fontTitle,
        fontSize: '1.5rem',
        color: '#222',
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
1px 0px 8px 0px rgba(34,34,34,0.05)`,
    },
    modalLabel = {
        display: 'flex',
        justifyContent: 'center',
        fontFamily: fontTitle,
        fontSize: '1.4rem',
        textTransform: 'uppercase',
    };

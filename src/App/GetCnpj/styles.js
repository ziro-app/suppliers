import { fontTitle, fontSizeSmall } from '@ziro/theme'

export const

    modalLabel = {
        display: 'flex',
        justifyContent: 'center',
        fontFamily: fontTitle,
        fontSize: fontSizeSmall,
        textTransform: 'uppercase'
    },
    modalBox = {
        zIndex: '999',
        display: 'grid',
        gridTemplateColumns: '80%',
        justifyContent: 'center',
        maxWidth: '300px',
        width: '85%',
        paddingBottom: '40px',
        borderRadius: '3px',
        textAlign: 'center',
        background: 'white',
        boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10),
		1px 0px 8px 0px rgba(34,34,34,0.05)`
    },
    svg = {
        justifySelf: 'center'
    },
    title = {
        fontFamily: fontTitle,
        textTransform: 'uppercase',
        paddingBottom: '20px'
    }

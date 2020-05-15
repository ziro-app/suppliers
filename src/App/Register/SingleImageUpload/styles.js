import { fontTitle, fontSizeInput, gradient, shadow, primaryColor, grayColor3, grayColor4 } from '@ziro/theme'

export const

    dropzone = {
        display: 'grid',
        alignContent: 'center',
        justifyItems: 'center',
        gridRowGap: '10px',
        border: `2px dashed ${grayColor3}`,
        borderRadius: '6px',
        color: primaryColor,
        textAlign: 'center'
    },

    instructions = {
        marginTop: '20px'
    },

    button = {
        display: 'block', // necessary for link version
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        MozAppearance: 'none',
        outline: 'none',
        cursor: 'pointer',
        maxWidth: '200px',
        width: '90%',
        padding: '8px 0px',
        border: 'none',
        borderRadius: '20px',
        fontFamily: fontTitle,
        fontSize: '1.3rem',
        color: '#FFF',
        background: gradient,
        boxShadow: `${shadow}`
    },

    btnDisabled = {
        ...button,
        cursor: 'initial',
        color: primaryColor,
        background: 'none',
        backgroundColor: grayColor4,
        boxShadow: 'none'
    },

    input = {
        opacity: 0
    },

    styleTag = `
	.dropzone {
		height: 100%;
		height: -webkit-fill-available;
		height: -moz-available;
	}
`
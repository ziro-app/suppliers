import { fontTitle, fontSizeInput, gradient, shadow, fontSizeSmall } from '@ziro/theme';

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
    marginTop: '10px'
},
modalContainer = {
    zIndex: '999',
    maxWidth: '500px',
    width: '90%',
    margin: '0 auto',
    padding: '5%',
    boxSizing: 'border-box',
    borderRadius: '3px',
    background: 'white',
    boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10),
1px 0px 8px 0px rgba(34,34,34,0.05)`
},
modalLabel = {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: fontTitle,
    fontSize: fontSizeSmall,
    textTransform: 'uppercase'
},
button = {
    display: 'block', // necessary for link version
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    MozAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    height: '18px',
    padding: '10px 0px',
    border: 'none',
    borderRadius: '20px',
    fontFamily: fontTitle,
    fontSize: fontSizeInput,
    color: '#FFF',
    textAlign: 'center',
    background: gradient,
    boxShadow: `${shadow}`
}
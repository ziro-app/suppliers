import { fontTitle, gradient, shadow } from '@ziro/theme';

export const custom = (fontSize, color) => ({
    display: 'grid',
    justifyItems: 'center',
    fontSize: `${(fontSize + 2) / 10}rem`,
    fontWeight: '500',
    color
}),
illustrationContainer = {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridRowGap: '20px',
    alignContent: 'start',
    justifyItems: 'center',
    marginTop: '-20px'
},
buttonContainer = {
    display: 'grid',
    gridRowGap: '15px',
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
},
btnRed = {
    ...btn,
    color: 'white',
    background: 'linear-gradient(#BA3A3A 10%, #B33 30%, #B22 60%, #800)'
}

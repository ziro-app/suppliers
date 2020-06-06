import { primaryColor, fontTitle, fontSizeSmall, gradient, shadow } from '@ziro/theme';

export const

custom = (fontSize, color) => ({
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
modalLabel = {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: fontTitle,
    fontSize: fontSizeSmall,
    textTransform: 'uppercase'
},
container = {
    display: 'grid',
    alignContent: 'center',
    gridRowGap: '15px',
    color: primaryColor,
    textAlign: 'center'
},

svg = {
    justifySelf: 'center'
},

title = {
    fontFamily: fontTitle,
    textTransform: 'uppercase'
},

boxStyle = {
    zIndex: '999',
    maxWidth: '500px',
    width: '95%',
    margin: '0 auto',
    padding: '0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    background: 'white',
    boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10), 1px 0px 8px 0px rgba(34,34,34,0.05)`
},

imgStyle = {
    display: 'grid',
    width: '100%'
},

controls = {
    zIndex: '999999',
    position: 'fixed',
    bottom: '0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    justifyItems: 'center',
    width: '100%',
    maxWidth: '400px',
    margin: '0 0 0 -20px',
    padding: '10px 0',
    background: 'white',
    boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10), 1px 0px 8px 0px rgba(34,34,34,0.05)`
},

circle = {
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: gradient,
    boxShadow: shadow
}
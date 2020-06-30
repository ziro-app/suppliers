import { fontTitle, successColor, alertColor } from '@ziro/theme';

export const modalContainer = {
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

outerContainer = hasTable => ({
    display: 'grid',
    gridTemplateRows: hasTable ? '1fr auto' : '1fr',
    gridRowGap: hasTable ? '40px' : '0px'
}),
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
labelBody = {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
},
modalBody = {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gridRowGap: '30px'
},
labelBodyContainer = {
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    textAlign: 'center'
},
containerButtons = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '20px'
},
customGrid = {
    gridTemplateColumns: '1fr 3fr 20px',
    gridRowGap: '15px',
    gridColumnGap: '10px',
    placeItems: 'end start'
},
customCell = {
    width: '100%',
    height: '100%',
    fontSize: '1.4rem',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
},
resultStyle = (resultStatus) => ({
    marginTop: '15px',
    padding: '0 0 5px',
    height: '24px',
    fontSize: '1.6rem',
    color: resultStatus ? successColor : alertColor,
    textAlign: 'center',
})
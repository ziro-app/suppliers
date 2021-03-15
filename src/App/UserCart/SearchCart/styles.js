import { primaryColor, secondaryColor, grayColor1, grayColor2, grayColor3, fontTitle } from '@ziro/theme'

export const

cart = {
    display: 'grid',
    gridRowGap: '40px'
},

statusBlock = {
    display: 'grid',
    gridRowGap: '15px'
},

statusName = {
    marginBottom: '-10px',
    padding: '0 10px',
    color: primaryColor,
    fontFamily: fontTitle,
    fontSize: '1.3rem',
    textTransform: 'uppercase'
},

card = {
    display: 'grid',
    padding: '12px 20px',
    background: 'white',
    borderRadius: '5px',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 3px 8px -1px',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'center',
    color: primaryColor
},

dot = {
    fontSize: '21px',
    color: secondaryColor
},

brandName = {
    fontSize: '1.2rem'
},

timestamp = {
    fontSize: '1.2rem',
    fontWeight: '500',
    color: grayColor2
},

bubble = {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    borderRadius: '50%',
    fontFamily: fontTitle,
    fontWeight: '600',
    color: primaryColor,
    background: grayColor3,
}
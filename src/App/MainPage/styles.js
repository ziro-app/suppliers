import { fontTitle, fontSizeSmall } from '@ziro/theme'

const dynamicWidth = () => {
  return window.innerWidth < 400 ? 'auto auto auto' : 'auto auto auto auto'
};

export const saldosContainer = {
  display: 'grid',
  rowGap: '35px',
  marginTop: '-10px'
},
consultasContainer = {
  display: 'grid',
  rowGap: '35px',
  marginTop: '35px'
},
card = {
  textAlign: 'center',
  width: '100%',
  padding: '20px 0px',
  borderRadius: '10px',
  marginBottom: '-22px',
  boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px',
},
cardSimplificado = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '100%',
  padding: '20px 2px',
  borderRadius: '10px',
  marginBottom: '-22px',
  boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px',
  justifyContent: 'center',
  alignItems: 'center'
},
cardTop = {
  display: 'flex',
  textAlign: 'center',
  width: '100%',
  padding: '20px 0px',
  borderRadius: '10px',
  marginBottom: '-22px',
  boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px',
},
saldosLabel = {
  opacity: '55%',
  fontSize: '1.1rem'
},
activePlan = {
  opacity: '60%',
},
iconsContainer = {
  display: 'grid',
  gridTemplateColumns: dynamicWidth(),
  justifyContent: 'space-between',
  marginTop: '50px'
},
iconDivContainer = {
  // width: '100%'
},
valorH1 = {
  textAlign: 'center',
  fontSize: '1.8rem',
  margin: '0',
},
iconDiv = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer'
},
iconStyle = {
  borderRadius: '40%',
  padding: '20px',
  boxShadow: 'rgba(34, 34, 34, 0.7) 0px 3px 11px -4px',
  backgroundColor: '#222'
},
iconDescription = {
  marginTop: '5px',
  marginBottom: '12px',
  textAlign: 'center',
  opacity: '80%'
}
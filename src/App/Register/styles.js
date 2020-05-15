import { fontTitle, fontSizeSmall } from '@ziro/theme'

export const

	welcome = {
		fontFamily: fontTitle,
		fontSize: '2.1rem'
	},

	marker = {
		background: `linear-gradient(transparent 60%, rgba(255,228,0,0.75) 100%)`,
	},
	modalContainer = {
		display: 'grid',
		margin: '30px 0 15px',
		textAlign: 'center'
	},
	modalLabel = {
		display: 'flex',
		justifyContent: 'center',
		fontFamily: fontTitle,
		fontSize: fontSizeSmall,
		textTransform: 'uppercase'
	},
	modalBox = {
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
	}
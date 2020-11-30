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
		margin: '15px 0px',
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
		padding: '20px',
		boxSizing: 'border-box',
		borderRadius: '3px',
		background: 'white',
		boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10),
		1px 0px 8px 0px rgba(34,34,34,0.05)`
	},
	advantagesContainer = {
		display: 'grid',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '20px',
		backgroundColor: '#f4f4f4',
		borderRadius: '5px',
		padding: '10px 10px'
	},
	advantagesDiv = {
		display: 'grid',
		gridTemplateColumns: 'auto 1fr',
		alignItems: 'center',
		padding: '5px 3px',
	},
	innerAdvantagesDiv = {
		display: 'grid',
		placeItems: 'center',
		boxShadow: 'rgba(34, 34, 34, 0.7) 0px 3px 11px -4px',
		borderRadius: '100%',
		width: '30px',
		height: '30px',
		background: 'white'
	},
	advantagesLabel = {
		fontSize: '1.6rem',
		paddingLeft: '10px',
		textAlign: 'left'
	}
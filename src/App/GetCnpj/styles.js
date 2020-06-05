import { fontTitle, fontSizeSmall, fontSizeInput, gradient, shadow } from '@ziro/theme'

export const

	modalLabel = {
		display: 'flex',
		justifyContent: 'center',
		fontFamily: fontTitle,
		fontSize: fontSizeSmall,
		paddingBottom: '40px',
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
	btn = {
		display: 'block', // necessary for link version
		WebkitAppearance: 'none',
		WebkitTapHighlightColor: 'rgba(0,0,0,0)',
		MozAppearance: 'none',
		outline: 'none',
		cursor: 'pointer',
		width: '100%',
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
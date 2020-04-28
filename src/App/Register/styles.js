import { fontTitle, fontSizeInput, gradient, shadow } from '@ziro/theme'

export const

	welcome = {
		fontFamily: fontTitle,
		fontSize: '2.1rem'
	},

	marker = {
		background: `linear-gradient(transparent 60%, rgba(255,228,0,0.75) 100%)`,
	},

	button = {
		marginTop: '20px',
		display: 'block', // necessary for link version
		WebkitAppearance: 'none',
		WebkitTapHighlightColor: 'rgba(0,0,0,0)',
		MozAppearance: 'none',
		outline: 'none',
		cursor: 'pointer',
		width: '100%',
		border: 'none',
		borderRadius: '20px',
		fontFamily: fontTitle,
		fontSize: fontSizeInput,
		color: '#FFF',
		textAlign: 'center',
		background: gradient,
		boxShadow: `${shadow}`
	}
import { fontTitle, fontBody, primaryColor, grayColor1, gradient } from '@ziro/theme';

export const container = {
        display: 'grid',
        gridTemplateColumns: '1fr 2.5fr 1fr',
        alignItems: 'center',
        maxWidth: '500px',
        height: '50px',
        margin: '0',
        padding: '0 20px',
        fontFamily: fontTitle,
        color: primaryColor,
        background: 'white',
        boxShadow: '0px 2px 4px 0px rgba(34,34,34,0.25)',
    },
    headerTitle = {
        textAlign: 'center',
        fontSize: '1.8rem',
    },
    bottomTabLabel = {
        fontFamily: fontTitle,
        color: 'black',
    },
    priceButton = {
        display: 'grid',
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        MozAppearance: 'none',
        outline: 'none',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '200px',
        padding: '6px 0px',
        border: 'none',
        borderRadius: '20px',
        fontFamily: fontTitle,
        fontSize: '1.0rem',
        color: '#FFF',
        textAlign: 'center',
        background: gradient,
        boxShadow: `0px 3px 8px -3px rgba(34,34,34,0.65)`,
    },
    searchBar = {
        fontKerning: 'normal',
        fontFeatureSettings: '"kern","liga","clig","calt","kern"',
        boxSizing: 'inherit',
        font: 'inherit',
        overflow: 'visible',
        WebkitAppearance: 'none',
        outline: 'none',
        color: primaryColor,
        fontSize: '1.6rem',
        fontFamily: fontBody,
        textAlign: 'center',
        padding: '6px 35px 6px 0px',
        border: 'none',
        borderRadius: '25px',
    },
    inputPlaceholder = `
	input::placeholder {
    	color: ${grayColor1};
	}
	#debounceSearch:focus {
		box-shadow: ${grayColor1} 0px 0px 8px -4px !important;
	}
`;

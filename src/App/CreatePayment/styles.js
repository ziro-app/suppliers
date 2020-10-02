import { fontBody, fontSizeInput, primaryColor, grayColor1, grayColor2, grayColor3 } from '@ziro/theme';

export const inline = {
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
  padding: '0px 10px',
  fontFamily: `${fontBody}, 'system-ui', 'sans-serif'`,
  fontSize: fontSizeInput,
  color: primaryColor,
};

export const center = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '20%' };

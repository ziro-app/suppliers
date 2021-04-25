import themes from '../../themes';

export const container: React.CSSProperties = {
  width: '100%',
};

export const defaultInputStyle: React.CSSProperties = {
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
  padding: '8px 22px',
  border: `2px solid #E0E0E0`,
  borderRadius: '8px',
  fontFamily: themes.fontFamily.body,
  fontSize: themes.fontSize.small,
  color: themes.colors.primary,
  backgroundColor: '#FDFDFD',
  boxShadow: `rgba(34,34,34,0.3) 0px 3px 10px -3px`,
};

export const styleTag = `
input:disabled {
background: none;
}
input::placeholder {
  color: ${themes.colors.gray2};
}
.input-text:focus {
border: 2px solid '#828282' !important;
box-shadow: rgba(34, 34, 34, 0.3) 0px 3px 10px -2px !important;
}
`;

export const errorContainer: React.CSSProperties = {
  width: '100%',
  height: '15px',
  display: 'flex',
  marginLeft: '2px',
};

export const errorText: React.CSSProperties = {
  fontSize: themes.fontSize.xsmall,
  fontWeight: themes.fontWeight.title,
  color: themes.colors.alert,
};

export const errorIcon: React.CSSProperties = {
  strokeWidth: '3px',
  stroke: themes.colors.alert,
};

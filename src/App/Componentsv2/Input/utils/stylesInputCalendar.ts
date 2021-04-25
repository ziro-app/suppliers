import themes from '../../themes';
import React from 'react';

export const inputStyle: React.CSSProperties = {
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
  padding: '8px 22px',
  border: `2px solid #E0E0E0`,
  borderRadius: '8px',
  fontFamily: themes.fontFamily.body,
  fontSize: themes.fontSize.largeMedium,
  color: themes.colors.primary,
  backgroundColor: '#FDFDFD',
  boxShadow: `rgba(34,34,34,0.3) 0px 3px 10px -3px`,
  position: 'relative',
  marginBottom: '15px',
};

export const clearBtn: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '16px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: 'transparent',
  color: 'rgba(34,34,34,0.3)',
  cursor: 'pointer',
  zIndex: 999999999999,
  fontFamily: themes.fontFamily.body,
};

export const popUpStyle = `
  .DayPickerInput > div {
    left: 0px;
    background-color: #fff;
  }

  .DayPicker-Day--selected {
    background-color: ${themes.colors.accent} !important;
    font-weight: ${themes.fontWeight.title} !important;
  }

  .DayPicker-Day--today {
    color: ${themes.colors.accent} !important;
    font-weight: ${themes.fontWeight.title} !important;
  }

  .DayPicker-Day--selected.DayPicker-Day--today {
    color: #fff !important;
  }

  .DayPicker-wrapper {
    border: 1px solid rgba(34,34,34 0.3) !important;
    border-radius: 5px !important;
    box-shadow: rgba(34, 34, 34, 0.3) 0px 3px 10px -3px;
  }

  .DayPicker-NavButton.DayPicker-NavButton--prev {
    padding: 0.8rem;
  }

  .DayPicker-NavButton.DayPicker-NavButton--next {
    padding: 0.8rem;
  }

  .DayPickerInput {
    width: 100%;
  }

  .DayPicker-Footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .DayPickerInput > input {
    webkit-appearance: none;
    moz-appearance: none;
    outline: none;
    box-sizing: border-box;
    width: 100%;
    padding: 8px 22px;
    border: 2px solid #E0E0E0;
    border-radius: 8px;
    font-family: ${themes.fontFamily.body};
    font-size: ${themes.fontSize.small};
    color: ${themes.colors.primary};
    background-color: #FDFDFD;
    box-shadow: rgba(34,34,34,0.3) 0px 3px 10px -3px;
    position: relative;
    margin-bottom: 5px;
  }

  .DayPicker-Caption {
    font-family: ${themes.fontFamily.title};
    font-size: ${themes.fontSize.medium}
  }

  .DayPicker-Weekday {
    font-family: ${themes.fontFamily.body};
    font-size: ${themes.fontSize.smallMedium};
    color: ${themes.colors.primary};
  }

  .DayPicker-Day {
    font-family: ${themes.fontFamily.body};
    font-size: ${themes.fontSize.medium};
    font-weight: ${themes.fontWeight.muted};
    padding: 1.06rem;
  }
`;

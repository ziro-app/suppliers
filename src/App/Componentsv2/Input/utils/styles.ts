import themes from "@bit/ziro.utils.themes"
import React from "react"

export const container: React.CSSProperties = {
  width: "100%",
}

export const defaultInputStyle: React.CSSProperties = {
  WebkitAppearance: "none",
  MozAppearance: "none",
  outline: "none",
  boxSizing: "border-box",
  width: "100%",
  padding: "8px 22px",
  border: `2px solid #E0E0E0`,
  borderRadius: "8px",
  fontFamily: themes.fontFamily.body,
  fontSize: themes.fontSize.small,
  color: themes.colors.primary,
  backgroundColor: "#FDFDFD",
  boxShadow: `rgba(34,34,34,0.3) 0px 3px 10px -3px`,
}

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
`

export const errorContainer: React.CSSProperties = {
  width: "100%",
  height: "15px",
  display: "flex",
  marginLeft: "2px",
}

export const errorText: React.CSSProperties = {
  fontSize: themes.fontSize.xsmall,
  fontWeight: themes.fontWeight.title,
  color: themes.colors.alert,
}

export const errorIcon: React.CSSProperties = {
  strokeWidth: "3px",
  stroke: themes.colors.alert,
}

export const calendarStyle = `
.DayPickerInput > div {
  left: 20px;
  background-color: #fff;
}

.DayPicker-Day--selected {
  background-color: ${themes.colors.accent} !important;
  font-weight: ${themes.fontWeight.title} !important;
  border-radius: 0px !important;
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
  margin-right: 33px;
  margin-top: -3px;
  width: 25px;
  height: 25px;
}

.DayPicker-NavButton.DayPicker-NavButton--next {
  margin-top: -3px;
  width: 25px;
  height: 25px;
}
.DayPicker-Footer {
  display: flex;
  align-items: center;
  justify-content: center;
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
`

export const buttonClearInputCalendar: React.CSSProperties = {
  position: "absolute",
  right: 9,
  top: 8,
  background: themes.colors.gray2,
  width: "18px",
  minHeight: "18px",
  height: "18px",
  padding: "0px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "none",
}

export const calendarContainer: React.CSSProperties = {
  position: "absolute",
  background: "#fff",
  borderRadius: "5px",
  left: "2px",
  zIndex: 99999,
}

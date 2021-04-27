import React from "react"

export const ImageIcon = ({ onClick, colorFill }) => (
  <div
    style={{
      borderRadius: "40%",
      padding: "20px",
      boxShadow: "rgba(34, 34, 34, 0.7) 0px 3px 11px -4px",
      backgroundColor: "#222",
    }}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="17.5"
      viewBox="0 0 24 24"
      fill={colorFill}
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-image"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  </div>
)

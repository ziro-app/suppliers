import React from 'react';
import { primaryColor } from '@ziro/theme';

export const CartIcon = ({ colorFill, strokeWidth, strokeColor, color, onClick }) => (
    <div 
        style={{ borderRadius: '40%', padding: '20px', boxShadow: 'rgba(34, 34, 34, 0.7) 0px 3px 11px -4px', backgroundColor: '#222' }}
        onClick={onClick}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="17.5"
            viewBox="0 0 24 24"
            fill={colorFill ? colorFill : 'none'}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-shopping-cart"
            color={color}
        >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
    </div>
);
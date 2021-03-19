import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { containerDuplicateImageClass } from './styles';

export default ({ setDuplicateImageModal }) => {
    return (
        <>
            <Icon
                type="copy"
                size={15}
                className="btn"
                strokeWidth={2}
                style={containerDuplicateImageClass}
                onClick={() => setDuplicateImageModal(true)}
                color="#222"
            />
        </>
    );
}

import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { fileContainerDeleteImageClass } from './styles';

export default ({ setRemoveImageModal }) => {
    return (
        <>
            <Icon type="trash" size={15} strokeWidth={2} style={fileContainerDeleteImageClass}
                  onClick={() => setRemoveImageModal(true)} color="red"/>
        </>
    );
}

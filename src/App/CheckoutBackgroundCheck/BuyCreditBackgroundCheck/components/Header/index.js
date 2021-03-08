/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { container, headerTitle, priceButton, inputPlaceholder } from './styles';

const commonProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};
export const HeaderWithoutModal = ({ title, onClickTitle = undefined, shadow = false, leftButton }) => {
    return (
        <div style={{ ...container, ...{ gridTemplateColumns: '1fr 10fr 1fr', boxShadow: shadow ? container.boxShadow : undefined } }}>
            <div>
                {leftButton && (
                    <motion.div {...commonProps} whileTap={{ scale: 0.95 }} onClick={leftButton.onClick}>
                        <Icon type={leftButton.icon} size={18} />
                    </motion.div>
                )}
            </div>
            <div>
                {title && (
                    <motion.div {...commonProps} style={{ display: 'grid' }} onClick={onClickTitle}>
                        <label style={headerTitle}>{title}</label>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

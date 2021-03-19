import React from 'react';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import { phases, title } from './styles';

export default ({ isSubmitting, brand, setBrand, brands }) => {
    return (
        <>
            <div style={phases}>
                <label style={title}>Fabricante</label>
                <Dropdown
                    readOnly={false}
                    submitting={isSubmitting}
                    value={brand}
                    onChange={({ target: { value } }) => setBrand(value)}
                    list={brands}
                    placeholder="Escolha um fabricante"
                    onChangeKeyboard={element => (element ? setBrand(element.value) : null)}
                />
            </div>
        </>
    );
};

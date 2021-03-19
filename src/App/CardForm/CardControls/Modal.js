import Button from '@bit/vitorbarbosa19.ziro.button';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import React from 'react';
import { modalContainer, modalLabel } from './styles';

export default ({ onClickFunction, openState, setOpenState, states, labelText }) => {
    return (
        <Modal boxStyle={modalContainer} isOpen={openState} setIsOpen={() => setOpenState(false)}>
            <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '20px' }}>
                <label style={modalLabel}>{labelText}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }}>
                    <Button type="button" cta="Sim" click={() => onClickFunction({ ...states })} template="regular"/>
                    <Button type="button" cta="Não" click={() => setOpenState(false)} template="light"/>
                </div>
            </div>
        </Modal>
    );
}

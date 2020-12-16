import React, { useState } from 'react'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Button from '@bit/vitorbarbosa19.ziro.button'
import searchCnpj from './searchCnpj'
import { modalBox, container, title, svg } from './styles'

const GetCnpj = ({ cnpj, setState , setErrorMsg, zoopId }) => {
    // const validCnaes = ['47.81-4-00', '14.12-6-01', '14.12-6-03', '46.41-9-01', '46.42-7-01', '14.12-6-02'];
    const [isOpen, setIsOpen] = useState(false)
    const [firstLabel, setFirstLabel] = useState(true)
    const state = { cnpj, setFirstLabel, setIsOpen, setErrorMsg }
    return (
        <>
            <Modal boxStyle={modalBox} isOpen={isOpen} setIsOpen={() => { }}>
                <div style={container}>
                    <div style={svg} ><Illustration type="waiting" size={200} /></div>
                    <label style={title}>{firstLabel ? 'Aguarde...' : 'Só mais um momento...'}</label>
                    <label>{firstLabel
                        ? 'Estamos atualizando o CNPJ. Não saia da página'
                        : 'Estamos concluindo a atualização. Não saia da página'}
                    </label>
                    <Spinner size='3rem' />
                </div>
            </Modal>
            <div style={{marginTop:'5px'}}>
                <Button
                    type="button"
                    cta="Atualizar dados CNPJ"
                    template="regular"
                    click={searchCnpj ? searchCnpj(state, setState, zoopId) : () => null}
                />
            </div>
        </>
    )
}

export default GetCnpj

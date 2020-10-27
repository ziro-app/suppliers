import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import ScoreCircle from '@bit/vitorbarbosa19.ziro.score-circle';
import maskInput from '@ziro/mask-input';
import validateDocuments from '../utils/validateDocuments';
import { userContext } from '../appContext';
import fetch from './fetch';
import sendToBackend from './sendToBackend';
import { box1, box2, wrapper } from './styles';

const BackgroundCheck = () => {
    const { docId } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [document, setDocument] = useState('');
    const [freeRequests, setFreeRequests] = useState(0);

    const [scoreValue, setScoreValue] = useState(0);
    const [blockPF, setBlockPF] = useState([]);
    const [blockPJ, setBlockPJ] = useState([]);

    // const [scoreValue, setScoreValue] = useState(0);
    // const [blockIdentification, setBlockIdentification] = useState([]);
    // const [blockFinancialTransparency, setBlockFinancialTransparency] = useState([]);
    // const [blockJudicialTransparency, setBlockJudicialTransparency] = useState([]);

    // const [blockDocument, setBlockDocument] = useState([]);
    // const [blockTransparency, setBlockTransparency] = useState([]);
    // const [blockLawsuits, setBlockLawsuits] = useState([]);


    const DEFAULT_STEP_COLORS = ['#ff0000', '#BC4646', '#EB5757', '#FFE401', '#FFCF25', '#FFAF39', '#FF9B07', '#4BCA81', '#3CA267', '#23fa1b'];
    const setState = { setDocument, setFreeRequests, setScoreValue, setBlockPF, setBlockPJ };
    const state = { docId, document, freeRequests, ...setState };
    const validations = [
        {
            name: 'document',
            validation: value => validateDocuments(value),
            value: document,
            message: document === '' ? 'Documento inválido' : document.length === 14 ? 'CPF inválido' : 'CNPJ inválido',
        }
    ];

    const clearInfo = () => {
        setBlockPF([]);
        setBlockPJ([]);
    };

    useEffect(() => fetch(setIsLoading, setErrorLoading, docId, setState), []);

    if (isLoading)
        return (
            <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <div style={{ display: 'grid', justifyContent: 'center', paddingBottom: '10px' }}>
                <strong style={{ fontSize: '1.5rem', fontFamily: 'Rubik' }} >{freeRequests ? `${freeRequests} consultas gratuitas restantes` : 'Consultas gratuitas esgotadas'}</strong>
            </div>

            <Form
                buttonOnTop
                buttonName="Consultar"
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend({ ...state, clearInfo }) : () => null}
                inputs={[
                    <FormInput name='document' label='CPF ou CNPJ' input={
                        <InputText
                            value={document}
                            onChange={({ target: { value } }) => {
                                let mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##';
                                setDocument(maskInput(value, mask, true));
                            }}
                            placeholder='000.000.000-00'
                            inputMode='numeric'
                        />
                    } />
                ]}
            />
            {blockPF.length > 0 &&
                <div style={wrapper}>
                    <div style={box1}>
                        <ScoreCircle
                            value={scoreValue}
                            maxValue={1000}
                            width={200}
                            lineWidth={20}
                            lineSpacing={1}
                            lineGap={1}
                            maxAngle={210}
                            rotation={90}
                            stepsColors={DEFAULT_STEP_COLORS}
                            fadedOpacity={25}
                        />
                    </div>
                    <div style={box2}>
                        <Details blocks={blockPF} blockGap='20px' />
                    </div>
                </div>
            }
            {blockPJ.length > 0 &&
                <Details blocks={blockPJ} blockGap='20px' />
            }

        </motion.div>
    )
}

export default BackgroundCheck;

import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import { userContext } from '../appContext';
import { db } from '../../Firebase/index';
import fetch from './fetch';
import { modalContainer, modalLabel, spinner, labelBody, modalBody, labelBodyContainer, containerButtons, customGrid, customCell, resultStyle } from './styles';

const Collaborators = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [collaboratorName, setCollaboratorName] = useState('');
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [collaboratorId, setCollaboratorId] = useState('');
    const [deleteResultText, setDeleteResultText] = useState('');
    const [deleteResultStatus, setDeleteResultStatus] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const { docId } = useContext(userContext);
    const setState = { setIsLoading, setErrorLoading, setCollaborators, setDataTable, setCollaboratorName, setCollaboratorEmail, setCollaboratorId, setDeleteResultText, setDeleteResultStatus, setDeleteModal };
    const state = { collaborators, dataTable, collaboratorName, collaboratorEmail, collaboratorId, deleteResultText, deleteResultStatus, deleteModal, ...setState };
    const [, setLocation] = useLocation();

    const deleteCollaborator = async () => {
        setIsLoading(true);
        try {
            await db.collection('collaborators').doc(collaboratorId).delete();
            setDeleteResultStatus(true);
            setDeleteResultText('Vendedor excluído com sucesso');
            setCollaboratorName('');
            setCollaboratorEmail('');
            setCollaboratorId('');
            setIsLoading(false);
            setTimeout(() => {
                setDeleteResultText('');
            }, 2500);
        } catch (error) {
            console.log(error);
            if (error.response) console.log(error.response);
            setDeleteResultStatus(false);
            setDeleteResultText('Erro ao excluir vendedor!');
            setCollaboratorName('');
            setCollaboratorEmail('');
            setCollaboratorId('');
            setIsLoading(false);
            setTimeout(() => {
                setDeleteResultText('');
            }, 2500);
        }
    };

    useEffect(() => fetch(setIsLoading, setErrorLoading, docId, setState), []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '15px' }}>
            <div>
                <Modal boxStyle={modalContainer} isOpen={deleteModal} setIsOpen={() => setDeleteModal(false)}>
                    <div style={modalBody}>
                        <label style={modalLabel}>Deseja realmente remover o vendedor ?</label>
                        <div style={labelBodyContainer}>
                            <label style={labelBody}>{collaboratorName}</label>
                            <label style={labelBody}>{collaboratorEmail}</label>
                        </div>
                        <div style={containerButtons}>
                            <Button type="button" cta="Sim" click={() => {
                                setDeleteModal(false);
                                deleteCollaborator();
                            }} template="regular" />
                            <Button type="button" cta="Não" click={() => setDeleteModal(false)} template="light" />
                        </div>
                    </div>
                </Modal>
                <Table
                    data={dataTable}
                    customGrid={customGrid}
                    cellStyle={customCell}
                />
            </div>
            <div>
                {deleteResultText ? (
                    <div style={resultStyle(deleteResultStatus)}>
                        <span>{deleteResultText}</span>
                    </div>
                ) : (
                        <div style={{ padding: '0 0 5px', height: '24px' }}>&nbsp;</div>
                    )}
                <Button type="button" cta="Convidar vendedor" click={() => setLocation('/convidar-colaborador')} template="regular" />
            </div>
        </motion.div>
    );
};

export default Collaborators;

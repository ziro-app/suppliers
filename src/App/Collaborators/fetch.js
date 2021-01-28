import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, docId, { setCollaborators, setDataTable, setCollaboratorName, setCollaboratorEmail, setCollaboratorId, setDeleteModal }) => {
    const run = async () => {
        try {
            await db.collection('collaborators').where('ownerId', '==', docId).onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    const collaborators = [];
                    const dataTable = [];
                    const rows = [];
                    snapshot.forEach(collaborator => {
                        const { fname, lname, email } = collaborator.data();
                        collaborators.push({ fname, lname, email, id: collaborator.id });
                        rows.push([fname, email, <Icon type="trash" size={16} onClick={() => {
                            setCollaboratorName(`${fname} ${lname}`);
                            setCollaboratorEmail(email);
                            setCollaboratorId(collaborator.id);
                            setDeleteModal(true);
                        }} style={{ width: '16px', height: '16px', display: 'grid', alignItems: 'center', justifyItems: 'center' }} />]);
                    });
                    dataTable.push({
                        title: 'Vendedores',
                        header: ['Nome', 'Email', ''],
                        rows: rows.reverse(),
                        align: 'start',
                        rowsClicks: [],
                        totals: []
                    });
                    setCollaborators(collaborators);
                    setDataTable(dataTable);
                    setIsLoading(false);
                    setErrorLoading(false);

                } else {
                    setCollaborators([]);
                    setDataTable([]);
                    setIsLoading(false);
                    setErrorLoading(false);
                }
            })
        } catch (error) {
            console.log(error);
            if (error.customError) setCustomError(true);
            else setErrorLoading(true);
            setIsLoading(false);
        }
    }
    run();
};

export default fetch;

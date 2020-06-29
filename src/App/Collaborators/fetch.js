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
                    const rowsClick = [];
                    snapshot.forEach(collaborator => {
                        const { fname, lname, email } = collaborator.data();
                        collaborators.push({ fname, lname, email, id: collaborator.id });
                        rows.push([fname, email, <Icon type="trash" size={14} />]);
                        rowsClick.push(() => {
                            setCollaboratorName(`${fname} ${lname}`);
                            setCollaboratorEmail(email);
                            setCollaboratorId(collaborator.id);
                            setDeleteModal(true);
                        });
                    });
                    dataTable.push({
                        title: 'Vendedores',
                        header: ['Nome', 'Email', ''],
                        rows: rows.reverse(),
                        rowsClicks: rowsClick.reverse(),
                        totals: []
                    });
                    setCollaborators(collaborators);
                    setDataTable(dataTable);
                    setIsLoading(false);
                    setErrorLoading(false);

                } else {
                    setCollaborators([]);
                    setIsLoading(false);
                    setErrorLoading(false);
                }
            })
            // const query = await db.collection('collaborators').where('ownerId', '==', docId).get();
            // if (!query.empty) {
            //     query.forEach(collaborator => {
            //         const { fname, lname, email } = collaborator.data();
            //         collaborators.push({ fname, lname, email, id: collaborator.id });
            //         rows.push([fname, email, <Icon type="trash" size={14} />]);
            //         rowsClick.push(() => {
            //             setCollaboratorName(`${fname} ${lname}`);
            //             setCollaboratorEmail(email);
            //             setCollaboratorId(collaborator.id);
            //             setDeleteModal(true);
            //         });
            //     });
            //     dataTable.push({
            //         title: 'Vendedores',
            //         header: ['Nome', 'Email', ''],
            //         rows: rows.reverse(),
            //         rowsClicks: rowsClick.reverse(),
            //         totals: []
            //     });
            //     setCollaborators(collaborators);
            //     setDataTable(dataTable);
            //     setIsLoading(false);
            //     setErrorLoading(false);
            // } else {
            //     setCollaborators([]);
            //     setIsLoading(false);
            //     setErrorLoading(false);
            // }
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

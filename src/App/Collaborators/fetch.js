import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, docId, { setCollaborators, setDataTable }) => {
    const collaborators = [];
    const dataTable = [];
    const rows = [];
    const rowsClick = [];
    const run = async () => {
        try {
            const query = await db.collection('collaborators').where('ownerId', '==', docId).get();
            if (!query.empty) {
                query.forEach(collaborator => {
                    const { fname, email, role } = collaborator.data();
                    collaborators.push({ fname, email, role, id: collaborator.id });
                    rows.push([fname, email, role, <Icon type="trash" size={14} />]);
                    rowsClick.push(() => console.log(collaborator.id));
                });
                dataTable.push({
                    title: 'Vendedores',
                    header: ['Nome', 'Email', 'Papel', ''],
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

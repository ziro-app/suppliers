import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Details from '@bit/vitorbarbosa19.ziro.details';
import { containerWithPadding } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import capitalize from '@ziro/capitalize';
import { functionSortDate, functionSort } from '../utils/sort';

const PendencyDetails = ({ pendency, setPendency }) => {
    const title = pendency.nome ?? 'Pendências';
    const [resumeBlock, setResumeBlock] = useState([]);
    const [blocks, setBlock] = useState([]);

    const mountBodyResume = ({ count, last, total }) => [
        { title: 'Data do último lançamento', content: last },
        { title: 'Total de lançamentos', content: count },
        { title: 'Valor total', content: currencyFormat(total) || 'R$ 0,00' }
    ];

    useEffect(() => {
        const { data } = pendency;
        let blockEffect = [];
        let bodyEffect = [];
        data.sort((a, b) => functionSortDate(a, b));
        data.map((it, index) => {
            Object.keys(it).map(key => {
                const title = capitalize(key);
                const content = title === 'Valor' ? currencyFormat(it[key]) || 'R$ 0,00' : it[key];
                bodyEffect.push({ title, content });
            });
            bodyEffect.sort((a, b) => functionSort(a.title, b.title));
            blockEffect.push({
                header: `Lançamento ${index + 1}`,
                body: bodyEffect
            });
            bodyEffect = [];
        });
        setBlock([...blocks, ...blockEffect]);
        setResumeBlock([{ header: 'Resumo', body: mountBodyResume(pendency) }]);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type="icon" title={title} setIsOpen={() => setPendency(null)} icon="back" />
            <div style={{ display: 'grid', gridRowGap: '30px' }}>
                <Details blocks={resumeBlock} />

                <div style={{ display: 'grid', gridRowGap: '15px' }}>
                    {blocks.map((block, index) => {
                        return (
                            <div key={index}>
                                <Details blocks={[block]} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default PendencyDetails;

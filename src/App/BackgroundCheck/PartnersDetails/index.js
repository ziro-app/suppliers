import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Details from '@bit/vitorbarbosa19.ziro.details';
import { containerWithPadding } from '@ziro/theme';
import capitalize from '@ziro/capitalize';
import { functionSort } from '../utils/sort';

const PartnersDetails = ({ partners, setPartners }) => {
    const title = partners.nome ?? 'Sócios';
    const [blocks, setBlock] = useState([]);

    useEffect(() => {
        const { data } = partners;
        let blockEffect = [];
        let bodyEffect = [];
        data.map((it, index) => {
            Object.keys(it).map(key => {
                const title = capitalize(key);
                bodyEffect.push({ title, content });
            });
            bodyEffect.sort((a, b) => functionSort(a.nome, b.nome));
            blockEffect.push({
                header: `Sócio ${index + 1}`,
                body: bodyEffect
            });
            bodyEffect = [];
        });
        setBlock([...blocks, ...blockEffect]);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type="icon" title={title} setIsOpen={() => setPartners(null)} icon="back" />
            <div style={{ display: 'grid', gridRowGap: '15px' }}>
                {blocks.map((block, index) => {
                    return (
                        <div key={index}>
                            <Details blocks={[block]} />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default PartnersDetails;

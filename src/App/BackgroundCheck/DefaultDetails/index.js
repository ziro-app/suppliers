import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Details from '@bit/vitorbarbosa19.ziro.details';
import { containerWithPadding } from '@ziro/theme';
import capitalize from '@ziro/capitalize';

const DefaultDetails = ({ defaultData, setDefaultData }) => {
    const title = defaultData.nome ?? 'Detalhes';
    const [blocks, setBlock] = useState([]);

    useEffect(() => {
        const { data, sortedFields, blockTitle = 'Registro', pj } = defaultData;
        let blockEffect = [];
        let bodyEffect = [];
        data.sort((a, b) => a.atvdPrimaria || b.atvdPrimaria);
        data.map((it, index) => {
            if (title === 'Endereços') {
                sortedFields.map(name => bodyEffect.push({ title: capitalize(name), content: it[name] }));
                if (!pj) bodyEffect.push({ title: 'País', content: it['pais'] || 'Não informado' });
            } else if (title === 'Participações societárias') {
                bodyEffect.push({ title: 'Empresa', content: it['nomeEmpresa'] || 'Não informado' });
                bodyEffect.push({ title: 'Cnpj', content: it['cnpjSocietario'] || 'Não informado' });
                sortedFields.map(name => bodyEffect.push({ title: capitalize(name), content: it[name] || 'Não informado' }));
                bodyEffect.push({ title: 'Tipo', content: it['posicao'] || 'Não informado' });
            } else if (title === 'Telefones') {
                bodyEffect.push({ title: 'Ativo', content: it['ativo'] !== undefined ? it['ativo'] ? 'Sim' : 'Não' : 'Não informado' });
                sortedFields.map(name => bodyEffect.push({ title: capitalize(name), content: it[name] }));
                bodyEffect.push({ title: 'Formatado', content: it['numFormatado'] });
            } else if (title === 'Emails') {
                if (!pj) sortedFields.map(name => bodyEffect.push({ title: capitalize(name), content: it[name] }));
                else bodyEffect.push({ title: 'Email', content: it });
                bodyEffect.push({ title: 'Ativo', content: it['ativo'] !== undefined ? it['ativo'] ? 'Sim' : 'Não' : 'Não informado' });
                bodyEffect.push({ title: 'Validado', content: it['emailValidado'] !== undefined ? it['emailValidado'] ? 'Sim' : 'Não' : 'Não informado' });
            } else if (title === 'Ramos de Atividade') {
                bodyEffect.push({ title: 'Atvd primária', content: it['atvdPrimaria'] ? 'Sim' : 'Não' });
                sortedFields.map(name => name === 'cnae' ? bodyEffect.push({ title: capitalize(name), content: it[name] }) : bodyEffect.push({ content: it[name], isDescription: true }));
            } else if (title === 'Sócios Administradores') {
                bodyEffect.push({ title: 'Nome', content: it['nomeSocio'] });
                sortedFields.map(name => bodyEffect.push({ title: capitalize(name), content: it[name] }));
                bodyEffect.push({ title: 'Participação', content: it['participacao'] });
                bodyEffect.push({ content: it['posicao'] || 'Não informado', isDescription: true });
            } else {
                sortedFields.map(name => bodyEffect.push({ title: capitalize(name), content: it[name] }));
            }

            blockEffect.push({
                header: `${blockTitle} ${index + 1}`,
                body: bodyEffect
            });
            bodyEffect = [];
        });
        setBlock([...blocks, ...blockEffect]);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type="icon" title={title} setIsOpen={() => setDefaultData(null)} icon="back" />
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

export default DefaultDetails;

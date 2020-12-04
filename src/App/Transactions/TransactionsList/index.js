import React   from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import { Menu } from '../../Menu/index';
import {getListMonth} from '../utils'
import {containerClearAll, btnClearAll,textClearAll} from '../styles'

export default ({ btnMoreClick, hasMore, state }) => {
  const {listStatus, isLoadingResults, firstDate, clientList, clientFilter, setClientFilter, statusFilter, setStatusFilter, monthFilter, setMonthFilter, loadingMore, setTransaction, payments:transactions, setIsLoadingResults} = state
  const listMonth = getListMonth(firstDate)
  const [, setLocation] = useLocation();
  const hadleClearAll = () => {
    setIsLoadingResults(true);
    setStatusFilter('')
    setMonthFilter('')
    setClientFilter('')
    localStorage.removeItem('statusFilter')
    localStorage.removeItem('clientFilter')
    localStorage.removeItem('monthFilter')
}
  return (
    <Menu title="Vendas">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <form style={{marginBottom:'10px'}}>
          <label aria-label='filtro por clientes'/>
          <Dropdown
              value={clientFilter || ''}
              list={clientList}
              placeholder="Filtrar Clientes"
              onChange={({ target: { value } }) => {
                  if (clientList.includes(value) || value === '') {
                      setIsLoadingResults(true);
                      localStorage.setItem('clientFilter', value);
                  }
                  setClientFilter(value);
              }}
              onChangeKeyboard={e => {
                  if(e){
                      if (clientList.includes(e.value) || e.value === '') {
                          setIsLoadingResults(true);
                          localStorage.setItem('clientFilter', e.value);
                      }
                      setClientFilter(e.value);
                  }
              }}
          />
          </form>
          <form style={{marginBottom:'10px'}}>
            <label aria-label='filtro por status'/>
            <Dropdown
                value={statusFilter || ''}
                list={listStatus}
                placeholder="Filtrar status"
                onChange={({ target: { value } }) => {
                    if (listStatus.includes(value) || value === '') {
                        setIsLoadingResults(true);
                        localStorage.setItem('statusFilter', value);
                    }
                    setStatusFilter(value);
                }}
                onChangeKeyboard={e => {
                    if(e){
                        if (listStatus.includes(e.value) || e.value === '') {
                            setIsLoadingResults(true);
                            localStorage.setItem('statusFilter', e.value);
                        }
                        setStatusFilter(e.value);
                    }
                }}
            />
            </form>
            <form style={{marginBottom:'20px'}}>
            <label aria-label='filtro por mês e ano'/>
            <Dropdown
                value={monthFilter || ''}
                list={listMonth}
                placeholder="Filtrar mês"
                onChange={({ target: { value } }) => {
                    if (listMonth.includes(value) || value === '') {
                        setIsLoadingResults(true);
                        localStorage.setItem('monthFilter', value);
                    }
                    setMonthFilter(value);
                }}
                onChangeKeyboard={e => {
                    if(e){
                        if (listMonth.includes(e.value) || e.value === '') {
                            setIsLoadingResults(true);
                            localStorage.setItem('monthFilter', e.value);
                        }
                        setMonthFilter(e.value);
                    
                    }
                }}
            />
            </form>
            <div style={containerClearAll}>
                    <button
                        style={btnClearAll}
                        type='submit'
                        onClick={hadleClearAll}
                    >
                        <span style={textClearAll}>
                            Limpar filtros
                        </span>
                    </button>
                </div>
        {isLoadingResults ? (
            <Spinner />
        ):(
            <Timeline
          transactions={transactions}
          transactionClick={({ transaction }) => {
            setTransaction({});
            setLocation(`/transacoes/${transaction.transactionId}`);
          }}
          btnMoreClick={btnMoreClick}
          hasMore={hasMore}
          isSearching={loadingMore}
          messageEmptyTransactions="Você ainda não realizou transações."
        />
        )}
      </motion.div>
    </Menu>
  );
};

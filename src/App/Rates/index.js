import React from 'react';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Table from '@bit/vitorbarbosa19.ziro.table';

import useLoadRates from './hooks/useLoadRates'

const Rates = () => {
    const {
        blockDetails,
        dataRows,
        isLoading,
        isError
    } = useLoadRates()

    const dataTable = (data, title) => ([
        {
            title,
            header: [
                'Parcela',
                'C/ Seguro',
                'S/ Seguro',
            ],
            rows: data,
            totals: [],
        },
    ])

    if(isLoading) <Spinner />
    
    if(isError) <Error />

    return (
        <div>
            <Details blocks={blockDetails} />
            {
                dataRows.map(data => (
                    <div
                        aria-label= 'table' 
                        key={data.brand}
                        style={{marginTop:'20px'}}
                    >
                        <Table 
                            data={
                                dataTable(
                                    data.content, 
                                    data.brand === 'americanexpress' 
                                    ? 'american express' 
                                    : data.brand
                                    )
                            }
                            customGrid={{
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gridRowGap: '5px',
                            }} 
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default Rates

const relatorio = (data) => {
    if(data){
        let constructor = ''
        for (let i = 0; i< data.length; i ++){
                    constructor += 
                `<tr>
                <td align="center" valign="top" style="border-bottom: 1px dotted rgba(0,0,0,0.1)">${data[i].venda}</td>
                <td align="center" valign="top" style="border-bottom: 1px dotted rgba(0,0,0,0.1)">${data[i].boleto}</td>
                <td align="center" valign="top" style="border-bottom: 1px dotted rgba(0,0,0,0.1)">${data[i].romaneio}</td>
                <td align="center" valign="top" style="border-bottom: 1px dotted rgba(0,0,0,0.1)">${data[i].lojista}</td>
                <td align="center" valign="top" style="border-bottom: 1px dotted rgba(0,0,0,0.1)">${data[i].valor}</td>
                <td align="center" valign="top" style="border-bottom: 1px dotted rgba(0,0,0,0.1)">${data[i].vencimento}</td>
                <td align="center" valign="top" style="border-bottom: 1px dotted rgba(0,0,0,0.1)">${data[i].receita}</td>
                </tr>
                `
            }
            return constructor
        }
}

export default relatorio
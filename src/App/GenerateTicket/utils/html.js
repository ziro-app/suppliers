import dateHourFormatterUTC3 from './format-data-utc3'
import relatorio  from './constructorRelatorio'

const html = (data, url) => {
    const result = `<table style="font-family: Arial" font-size="9px" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
    <tr>
        <td align="center" valign="top">
            <table style="max-width: 800px" border="1" cellpadding="0" cellspacing="0" width="100%" id="emailContainer">
                <tr>
                    <td align="center" valign="top">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailHeader">
                            <tr>
                                <td align="center" valign="top">
                                    <!-- THIS IS THE HEADER OF THE EMAIL -->
                                    <div style="margin-bottom: 20px"></div>
                                    <h2 style="display: inline; text-transform: uppercase; background: linear-gradient(transparent 60%, rgba(255,228,0,0.75) 100%)">ZIRO</h2>
                                    <h3 style="text-transform: uppercase">Relatório de Comissões ${data[0].fornecedor}</h3>
                                    <p>${dateHourFormatterUTC3(new Date())}</p>
                                    <div style="margin-bottom: 20px"></div>
                                    <!-- END HEADER -->
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                    <!-- Inicio saldo de hoje -->
                        <table width="100%" cellpadding="2">
                            <caption style="font-weight: bold; padding: 20px 0; margin-bottom: 20px; background: #222; color: #fff; text-transform: uppercase"><span style="color: #FFDD00; font-size: 20px">. </span>Vendas Realizadas com a Ziro<span style="color: #FFDD00; font-size: 20px"> .</span></caption>
                            <thead>
                                <tr>
                                    <th align="center" valign="top">Data</th>
                                    <th align="center" valign="top">Boleto</th>
                                    <th align="center" valign="top">Romaneio</th>
                                    <th align="center" valign="top">Cliente</th>
                                    <th align="center" valign="top">Valor</th>
                                    <th align="center" valign="top">Vencimento</th>
                                    <th align="center" valign="top">À Receber</th>
                                </tr>
                            </thead>
                            <tbody>
                             ${relatorio(data)}
                            </tbody>
                        </table>
                        <div style="margin-bottom: 20px"></div>
                        <a href="${url}" target="_blank"><button style="color:white;
                            background-color: black;
                            border-radius: 15px;
                            width: 45vh;
                            margin-top:3vh;
                            height: 5.4vh;
                            outline:none;
                            margin-bottom:20px;
                            font-family:Arial;
                            font-size: 12px">BOLETO GERADO</button></a>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`
    return result
}

export default html
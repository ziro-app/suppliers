import { successColor, warningColor } from '@ziro/theme';

const matchStatusColor = (status) => {
    if (status === 'Aprovada') return successColor;
    if (status === 'Aguardando Pagamento') return warningColor;
    if (status === 'Aguardando Boleto') return warningColor;
    if (status === 'Cancelado') return '#bb2124';
    return '#5bc0de';
}

export default matchStatusColor;
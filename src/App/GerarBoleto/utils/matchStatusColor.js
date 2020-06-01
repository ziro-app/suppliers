import { successColor, warningColor } from '@ziro/theme';

const matchStatusColor = (status) => {
    if (status === 'Pagamento Realizado') return successColor;
    if (status === 'Aguardando Pagamento') return warningColor;
    if (status === 'Comissões em Aberto') return warningColor;
    if (status === 'Cancelado') return '#bb2124';
    return '#5bc0de';
}

export default matchStatusColor;
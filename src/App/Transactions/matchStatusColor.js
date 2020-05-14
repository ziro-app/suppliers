import { successColor, warningColor, alertColor, otherColor } from '@ziro/theme';

const matchStatusColor = (status) => {
    if (status === 'Aprovada') return successColor;
    if (status === 'Aguardando Pagamento') return warningColor;
    if (status === 'Cancelado') return alertColor;
    return otherColor;
}

export default matchStatusColor;
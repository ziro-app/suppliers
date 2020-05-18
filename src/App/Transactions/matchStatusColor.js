import { successColor, warningColor, alertColor, otherColor } from '@ziro/theme';

const matchStatusColor = (status) => {
    if (status === 'Aprovado' || status === 'Pago') return successColor;
    if (status === 'Aguardando Pagamento' ||
        status === 'Pré Autorizado' ||
        status === 'Aprovação Pendente') return warningColor;
    if (status === 'Cancelado' || status === 'Falhado') return alertColor;
    return otherColor;
}

export default matchStatusColor;
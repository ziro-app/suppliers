import capitalize from '@ziro/capitalize';
import { successColor, warningColor, alertColor, otherColor } from '@ziro/theme';

const matchStatusColor = (status) => {
    const standardized = capitalize(status);
    if (standardized === 'Aprovado' ||
        standardized === 'Pago' ||
        standardized === 'Paid') return successColor;
    if (standardized === 'Aguardando Pagamento' ||
        standardized === 'Pré Autorizado' ||
        standardized === 'Aprovação Pendente' ||
        standardized === 'Pending') return warningColor;
    if (standardized === 'Cancelado' || standardized === 'Falhado') return alertColor;
    return otherColor;
}

export default matchStatusColor;
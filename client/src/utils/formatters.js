export const formatCurrency = (value) => {
    if(value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

export const formatPercent = (value) => {
  if (value === null || value === undefined) return '—';
  return `${parseFloat(value).toFixed(2)}%`;
};

export const formatDate = (dateString) => {
    if(!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
};

export const formatDateTime = (dateString) => {
    if(!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getPnLColor = (value) => {
    if(!value || value === 0) return '#94A3B8';
    return value > 0 ? '#00E676' : '#FF1744';
};

export const getStatusColor = (status) => {
    switch(status){
        case 'OPEN': return 'primary';
        case 'CLOSED': return 'default';
        case 'PARTIAL': return 'warning';
        case 'CANCELLED': return 'error';
        default: return 'default'; 
    }
};
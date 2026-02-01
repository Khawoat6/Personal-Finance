const getStoredCurrency = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('currency') || 'THB';
    }
    return 'THB';
};

export const formatCurrency = (amount: number, currency?: string): string => {
    const displayCurrency = currency || getStoredCurrency();
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: displayCurrency,
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatCurrencyInteger = (amount: number, currency?: string): string => {
    const displayCurrency = currency || getStoredCurrency();
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: displayCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

export const getMonthName = (monthIndex: number): string => {
    const date = new Date();
    date.setMonth(monthIndex);
    return date.toLocaleString('en-US', { month: 'long' });
};
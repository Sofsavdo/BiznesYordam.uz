export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '0 so\'m';
  
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount) + ' so\'m';
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    if (millions >= 10) {
      return Math.round(millions) + 'M so\'m';
    }
    return millions.toFixed(1) + 'M so\'m';
  }
  if (amount >= 1000) {
    return Math.round(amount / 1000) + 'K so\'m';
  }
  return formatCurrency(amount);
}

export function formatNumber(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '0';
  
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
}

export function formatPercentage(rate: number | string): string {
  const numericRate = typeof rate === 'string' ? parseFloat(rate) : rate;
  return `${(numericRate * 100).toFixed(0)}%`;
}

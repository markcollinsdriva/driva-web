export const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0, 
  minimumFractionDigits: 0,
})

export const percentageFormatter = (percent: number, decimals: number = 0) => `${(percent * 100).toFixed(decimals)}%`

export const calculatePresentValue = (inputs: {
  futureValue: number,
  interestRatePerPeriod: number,
  numberOfPeriods: number
}): number => {
  const { futureValue, interestRatePerPeriod, numberOfPeriods } = inputs
  return futureValue / Math.pow(1 + interestRatePerPeriod, numberOfPeriods -1) // // we subtract one because the last payment is the residual payment
}

import { PageName } from './types'
import { State } from './store'

interface PageConfig {
  name: PageName
  headingText?: string|null
  nextButtonText?: string|null
  nextPage: (state?: State) => PageName|null
  previousPage: (state?: State) => PageName|null
}

export const pageConfigs = new Map<PageName, PageConfig>([
  [PageName.Price, {
    name: PageName.Price,
    headingText: 'Vehicle Price',
    nextButtonText: 'Get started',
    nextPage: () => PageName.Vehicle,
    previousPage: () => null
  }],
  [PageName.Vehicle, {
    name: PageName.Vehicle,
    headingText: 'Loan Details',
    nextButtonText: 'Next: Employment',
    nextPage: () => PageName.Employment,
    previousPage: () => PageName.Price,
  }],
  [PageName.Employment, {
    name: PageName.Employment,
    headingText: 'Employment Details',
    nextButtonText: 'Next: Residency',
    nextPage: () => PageName.Residency,
    previousPage: () => PageName.Vehicle,
  }],
  [PageName.Residency, {
    name: PageName.Residency,
    headingText: 'Residency',
    nextButtonText: 'Next: Contact Details',
    nextPage: () => PageName.Details,
    previousPage: () => PageName.Employment,
  }],
  [PageName.Details, {
    name: PageName.Details,
    headingText: 'Final Details',
    nextButtonText: 'Get Your Savings Estimate',
    nextPage: () => PageName.Results,
    previousPage: () => PageName.Residency,
  }],
  [PageName.Results, {
    name: PageName.Results,
    headingText: 'Your estimate',
    nextPage: () => null,
    previousPage: () => PageName.Details,
  }],
  [PageName.Decline, {
    name: PageName.Decline,
    headingText: "We're sorry we can't assist you this time",
    nextPage: () => null,
    previousPage: () => PageName.Results,
  }]
  
])
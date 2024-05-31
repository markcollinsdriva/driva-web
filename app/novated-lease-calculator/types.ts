export enum PageName {
  Price = 'price',
  Vehicle = 'vehicle',
  Employment = 'employment',
  Residency = 'residency',
  Details = 'details',
  Results = 'results',
  Decline = 'decline',
}

export enum LeaseTerm {
  TwoYears = 2,
  ThreeYears = 3,
  FourYears = 4,
  FiveYears = 5,
}

export const leaseTermOptions = Object.freeze([
  { value: LeaseTerm.TwoYears.toString(), label: '2 years' },
  { value: LeaseTerm.ThreeYears.toString(), label: '3 years' },
  { value: LeaseTerm.FourYears.toString(), label: '4 years' },
  { value: LeaseTerm.FiveYears.toString(), label: '5 years' },
])

export enum ResidencyStatus {
  Citizen = 'citizen',
  PR = 'pr',
  Visa = 'visa',
}

export const residencyStatusOptions = Object.freeze([
  { value: ResidencyStatus.Citizen, label: 'Citizen' },
  { value: ResidencyStatus.PR, label: 'Permanent resident' },
  { value: ResidencyStatus.Visa, label: 'Visa' },
])

export enum EmploymentType {
  FullTime = 'fullTime',
  PartTime = 'partTime',
  Casual = 'casual',
  Contractor = 'contractor',
  Unemployed = 'unemployed',
  Pension = 'pension',
}

export const employmentTypeOptions = Object.freeze([
  { value: EmploymentType.FullTime, label: 'Full time' },
  { value: EmploymentType.PartTime, label: 'Part time' },
  { value: EmploymentType.Casual, label: 'Casual' },
  { value: EmploymentType.Contractor, label: 'Contractor' },
  { value: EmploymentType.Unemployed, label: 'Unemployed' },
  { value: EmploymentType.Pension, label: 'Pension' },
])


export enum LivingSiutation {
  Renting = 'renting',
  OwnerWithMortgage = 'ownerWithMortgage',
  OwnerWithoutMortgage = 'ownerWithoutMortgage',
  LivingWithParents = 'livingWithParents',
  Board = 'board',
}

export const livingSituationOptions = Object.freeze([
  { value: LivingSiutation.Renting, label: 'Renting' },
  { value: LivingSiutation.OwnerWithMortgage, label: 'Owner with mortgage' },
  { value: LivingSiutation.OwnerWithoutMortgage, label: 'Owner without mortgage' },
  { value: LivingSiutation.LivingWithParents, label: 'Living with parents' },
  { value: LivingSiutation.Board, label: 'Board' },
])






import { PageName, LeaseTerm, EmploymentType, ResidencyStatus, LivingSiutation } from './types'

export interface State {
  estimatedVehiclePrice: number|null
  isElectricOfPlugInHybrid: boolean|null
  leaseTerm: LeaseTerm|null
  grossAnnualSalary: number|null
  employmentType: EmploymentType|null
  residencyStatus: ResidencyStatus|null
  livingSituation: LivingSiutation|null
  firstName: string|null
  lastName: string|null
  dateOfBirthDay: string|null
  dateOfBirthMonth: string|null
  dateOfBirthYear: string|null
  email: string|null
  phoneNumber: string|null
  costPerMonth: number|null
  costLifeOfLoan: number|null
  savingOverLifeOfLoan: number|null
  applyLink: string|null
}

import { create } from 'zustand'
interface Store extends State {
  updateValue: <K extends keyof State>(key: K, value: State[K]) => void
}

const defaultState: State = {
  estimatedVehiclePrice: null,
  isElectricOfPlugInHybrid: null,
  leaseTerm: null,
  grossAnnualSalary: null,
  employmentType: null,
  residencyStatus: null,
  livingSituation: null,
  firstName: null,
  lastName: null,
  dateOfBirthDay: null,
  dateOfBirthMonth: null,
  dateOfBirthYear: null,
  email: null,
  phoneNumber: null,
  costPerMonth: null,
  costLifeOfLoan: null,
  savingOverLifeOfLoan: null,
  applyLink: null,
}

export const useStore = create<Store>((set) => ({
  ...defaultState,
  updateValue: (key, value) => set({ [key]: value }),
}))
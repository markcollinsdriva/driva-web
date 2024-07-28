'use client'

import { CurrencyInput } from '@/components/CurrencyInput'
import { ToggleButtons } from '@/components/ToggleButtons'
import { Box, Button, FormControl, FormHelperText, FormLabel, Container, Input, Select, Text, VStack, SimpleGrid, HStack } from '@chakra-ui/react'
import { useHomeLoanCalculator } from '@/app/calculator/home-loans/hooks/useHomeLoanCalculator'
import { FinancePurpose, Frequency, NumberOfApplicants, HomeLoan, NumberFrequency, InvestmentType } from '@/app/calculator/home-loans/config'
import { NumericFormat } from 'react-number-format'
import { Divider } from '@chakra-ui/react'

const currentyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0, 
  minimumFractionDigits: 0,
})

const percentFormatter = (percent: number, decimals: number = 0) => `${(percent * 100).toFixed(decimals)}%`


export default function Page() {
  const { homeLoan, updateValue, calculate } = useHomeLoanCalculator()

  return (
    <Container>
      <VStack spacing={4}>
        {/* <Text fontSize='xl'>Your income</Text>
        <FormControl>
          <FormLabel>Loan type</FormLabel>
          <ToggleButtons 
            options={[
              { label: 'New loan', value: FinancePurpose.New },
              { label: 'Refinance', value: FinancePurpose.Refinance }
            ]}
            onChange={(option) => updateValue(draft => {
              draft.homeLoan.financePurpose = option.value
            })}
            getIsSelected={option => option.value === homeLoan.financePurpose}
            getLabel={option => option.label}/>
        </FormControl> */}
        <Text w='full' fontSize='xl'>Who is this loan for?</Text>
        <FormControl>
          <ToggleButtons 
            options={[
              { label: 'Just me', value: NumberOfApplicants.One },
              { label: 'Me and a partner', value: NumberOfApplicants.Two }
            ]}
            onChange={(option) => updateValue(draft => {
              draft.homeLoan.numberOfApplicants = option.value
            })}
            getIsSelected={option => option.value === homeLoan.numberOfApplicants}
            getLabel={option => option.label}/>
        </FormControl>
        <Text w='full' fontSize='xl'>What is your loan purpose?</Text>
        <FormControl>
          {/* <FormLabel>Purpose</FormLabel> */}
          <ToggleButtons 
            options={[
              { label: 'Live in', value: InvestmentType.LiveIn },
              { label: 'Invest', value: InvestmentType.Investment }
            ]}
            onChange={(option) => updateValue(draft => {
              draft.homeLoan.investmentType = option.value
            })}
            getIsSelected={option => option.value === homeLoan.investmentType}
            getLabel={option => option.label}/>
        </FormControl>
        <Text w='full' fontSize='xl'>Dependents</Text>
        <FormControl>
          <FormLabel>How many dependents do you support?</FormLabel>
            <Select 
              value={homeLoan.numberOfDependents?.toString() ?? '0'}
              onChange={(e) => updateValue(draft => {
                draft.homeLoan.numberOfDependents = e.target.value ? Number(e.target.value) : null
              })}
              >
              <option value='0'>0</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6 or more</option>
            </Select>
          <FormHelperText>Children under the age of 18 or adults who depend on your income and live in your home.</FormHelperText>
        </FormControl>
        <Text w='full' fontSize='xl'>Your income</Text>
        <NumberFrequencyInputSimple
          label='Salary'
          helperText='Include salary before tax.'
          objectGetter={homeLoan => homeLoan.income.applicant1Income.base}/>
        <NumberFrequencyInputSimple
          label='Supplementary income'
          helperText='Include regular bonuses, commissions and overtime'
          objectGetter={homeLoan => homeLoan.income.applicant1Income.supplementary}/>
        <NumberFrequencyInputSimple
          label='Other income'
          helperText='Include income such as allowances and government benefits.'
          objectGetter={homeLoan => homeLoan.income.applicant1Income.other}/>

        {homeLoan.numberOfApplicants === NumberOfApplicants.Two ? 
          <>
            <Text w='full' fontSize='xl'>Co borrower income</Text>
            <NumberFrequencyInputSimple
              label='Salary'
              helperText='Include salary before tax.'
              objectGetter={homeLoan => homeLoan.income.applicant2Income.base}/>
            <NumberFrequencyInputSimple
              label='Supplementary income'
              helperText='Include regular bonuses, commissions and overtime'
              objectGetter={homeLoan => homeLoan.income.applicant2Income.supplementary}/>
            <NumberFrequencyInputSimple
              label='Other income'
              helperText='Include income such as allowances and government benefits.'
              objectGetter={homeLoan => homeLoan.income.applicant2Income.other}/>
            <Text fontSize='xl'>Other income</Text>
          </> : null}

        <NumberFrequencyInputSimple
          label='Rental Income'
          helperText='Income from an investment property you want to buy or already own.'
          objectGetter={homeLoan => homeLoan.income.rentalIncome}/>
        <Text w='full'fontSize='xl'>Expenses</Text>
        <NumberFrequencyInputSimple
          label='Total living expenses'
          helperText='Include all borrowers ongoing expenses e.g. food, bills, utilities, education, entertainment.'
          objectGetter={homeLoan => homeLoan.expenses.livingExpenses}/>
        <NumberFrequencyInputSimple
          label='Rent'
          helperText='Ongoing rental payments.'
          objectGetter={homeLoan => homeLoan.expenses.rentalExpenses}/>
        <NumberFrequencyInputSimple
          label='Loan repayments'
          helperText='Include all borrowers car loans, personal loans or student loan repayments.'
          objectGetter={homeLoan => homeLoan.expenses.loanRepayments}/>
        <FormControl>
          <FormLabel>Credit card limits</FormLabel>
          <CurrencyInput 
            value={(homeLoan.liabilities.creditCardLimit ?? 0)} 
            onValueChange={value => updateValue(draft => {
              draft.homeLoan.liabilities.creditCardLimit  = (value ? Number(value) : 0)
            })} />
          <FormHelperText>Combined limits of all borrowers, including store cards.</FormHelperText>
        </FormControl>
        <Divider />

        <Box w='full'>
          <Text fontSize='2xl'>Borrowing power </Text>
          <Text fontSize='xl'>
            Up to  {homeLoan.maxLoanAmount ? currentyFormatter.format(homeLoan.maxLoanAmount): null}
          </Text>
        </Box>
        <Divider />
        <Text w='full' fontSize='2xl'>Scenario planner</Text>
        <SimpleGrid columns={2} spacing={4} w='full'>
          <Box>
            <Text fontSize='xl'>Property value</Text>
            <Text fontSize='xl'> {currentyFormatter.format((homeLoan.loanAmount ?? 0) + (homeLoan.loanDeposit ?? 0))}</Text>
            <Text fontSize='xs'>Excludes stamp duty</Text>
            <Text fontSize='xs'>and LMI premium</Text>
          </Box>
          <Box>
            <Text fontSize='xl'>Repayments</Text>
            {homeLoan.repaymentAmount ? <Text fontSize='xl'>{currentyFormatter.format(homeLoan.repaymentAmount)}</Text> : null}
            <Text fontSize='sm'>per month</Text>
          </Box>
        </SimpleGrid>
        <Box w='full'>
          <Text fontSize='xl'>Loan</Text>
          <HStack>
            <Text fontSize='xl'>{currentyFormatter.format(homeLoan.loanAmount ?? 0)}</Text>
            <Select 
              size='sm'
              mt='1'
              w='36'
              border='none'
              value={homeLoan.loanTermYears?.toString() ?? '30'} 
              onChange={e => updateValue(draft => {
                draft.homeLoan.loanTermYears = (e.target.value ? Number(e.target.value ) : 0)
              })}  >
              <option value='30'>Over 30 years</option>
              <option value='25'>Over 25 years</option>
              <option value='20'>Over 20 years</option>
              <option value='15'>Over 15 years</option>
              <option value='10'>Over 10 years</option>
            </Select>
          </HStack>
          <Slider
            min={80000}
            max={homeLoan.maxLoanAmount ?? 0}
            value={homeLoan.loanAmount ?? 0} 
            onChange={(value) => updateValue(draft => {
              draft.homeLoan.loanAmount = value ?? 0
            })}>  
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Box w='full'>
          <Text fontSize='xl'>Your deposit</Text>
          <HStack>
            <Text fontSize='xl'>{currentyFormatter.format(homeLoan.loanDeposit ?? 0)}</Text>
            <Text mt='1' fontSize='md'>{percentFormatter(homeLoan.loanDepositPerc ?? 0)} of loan</Text>
          </HStack>
          <Slider
            min={(homeLoan.loanAmount ?? 0) * .05}
            max={(homeLoan.loanAmount ?? 0) * .5}
            value={homeLoan.loanDeposit ?? 0} 
            onChange={(value) => updateValue(draft => {
              draft.homeLoan.loanDeposit = value ?? 0
            })}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
    
        <Box w='full' >
          <Text fontSize='lg'>Interest rate</Text>
          {homeLoan.interestRatePerAnnum ? <Text fontSize='xl'>{percentFormatter(homeLoan.interestRatePerAnnum, 2)}</Text> : null}
        </Box>
    

        <Button onClick={() => calculate()}>Calculate</Button>
      </VStack>
    </Container>
  )
}

import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
  } from '@chakra-ui/react'

const NumberFrequencyInput = ({ 
  label,
  helperText,
  value, 
  onValueChange, 
  frequencyValue, 
  onFrequencyChange 
}: { 
  label: string
  helperText?: string
  value: number, 
  onValueChange: (value?: number) => unknown, 
  frequencyValue: Frequency, 
  onFrequencyChange: (value: string) => unknown
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Box position='relative'>
        <CurrencyInput 
          value={value} 
          onValueChange={onValueChange}/>
        <Box position='absolute' right='0' top='0'>
          <FrequencySelect 
            border='none'
            value={frequencyValue}
            onChange={e => onFrequencyChange(e.target.value)}
          />
        </Box>
      </Box>

      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  )
}

const NumberFrequencyInputSimple = ({
  label,
  helperText,
  objectGetter
}: {
  label: string
  helperText?: string,
  objectGetter: (homeLoan: HomeLoan) => NumberFrequency
}) => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <NumberFrequencyInput 
      label={label}
      helperText={helperText}
      value={objectGetter(homeLoan).number} 
      onValueChange={value => updateValue(draft => {
        if (!value) return
        objectGetter(draft.homeLoan).number = value
      })}
      frequencyValue={objectGetter(homeLoan).frequency}
      onFrequencyChange={value => updateValue(draft => {
        objectGetter(draft.homeLoan).frequency = value as Frequency
      })}/>
  )
}

const FrequencySelect = (props: React.ComponentProps<typeof Select>) => {
  return (
    <Select {...props} >
      <option value={Frequency.Weekly}>Weekly</option>
      <option value={Frequency.Fortnightly}>Fortnightly</option>
      <option value={Frequency.Monthly}>Monthly</option>
      <option value={Frequency.Yearly}>Yearly</option>
    </Select>
  )
}



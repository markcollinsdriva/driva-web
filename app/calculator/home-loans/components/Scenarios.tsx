'use client'

import { 
  Box, 
  Select, 
  Text, 
  SimpleGrid, 
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Heading, 
} from '@chakra-ui/react'
import { useHomeLoanCalculator } from '@/app/calculator/home-loans/hooks/useHomeLoanCalculator'
import { currencyFormatter, percentageFormatter } from './formatter'

export const BorrowingPowerResults = () => {
  const { homeLoan } = useHomeLoanCalculator()

  return (
    <SimpleGrid columns={2} spacing={4} w='full'>
      <Box w='full'>
        <Heading fontSize='xl'>Maximum you can borrow</Heading>
        <Text fontSize='sm'>Based on what you can afford</Text>
        <Text fontSize='2xl'>
          {homeLoan.maxLoanAmount ? currencyFormatter.format(homeLoan.maxLoanAmount): null}
        </Text>
      </Box>
      <Box w='full'>
        <Heading fontSize='xl'>Interest rate</Heading>
        <Text fontSize='sm'>Interest rate / Comparison rate</Text>
        <HStack>
          <Text fontSize='2xl'>
            {homeLoan.interestRatePerAnnum ? <Text fontSize='2xl'>{percentageFormatter(homeLoan.interestRatePerAnnum, 2)}</Text> : null}
          </Text>
          <Text>/</Text>
          <Text fontSize='2xl'>
            {homeLoan.interestRatePerAnnum ? <Text fontSize='2xl'>{percentageFormatter(homeLoan.interestRatePerAnnum, 2)}</Text> : null}
          </Text>
        </HStack>
      </Box>
    </SimpleGrid>
  )
}

export const ScenarioPlanner = () => {
  const { homeLoan } = useHomeLoanCalculator()

  return (
    <>
      <SimpleGrid columns={2} spacing={4} w='full'>
        <Box>
          <Heading fontSize='xl'>Property you could buy</Heading>
          <Text fontSize='sm'>Loan + Deposit</Text>
          <Text fontSize='2xl'> {currencyFormatter.format((homeLoan.loanAmount ?? 0) + (homeLoan.loanDeposit ?? 0))}</Text>
          <Text fontSize='sm'>Excludes stamp duty and LMI premium</Text>
        </Box>
        <Box>
          <Heading fontSize='xl'>Repayments</Heading>
          {/* {homeLoan.interestRatePerAnnum ? <Text fontSize='sm'>Interest rate of {percentageFormatter(homeLoan.interestRatePerAnnum, 2)}</Text> : null} */}
          <Text fontSize='sm'>Per month</Text>
          {homeLoan.repaymentAmount ? <Text fontSize='2xl'>{currencyFormatter.format(homeLoan.repaymentAmount)}</Text> : null}
          {/* <Text fontSize='sm'>Per month</Text> */}
        </Box>
        
      </SimpleGrid>
    </>
  )
}

export const LoanAmountInput = () => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <Box w='full'>
      <Heading fontSize='xl'>Your Loan</Heading>
      <Text fontSize='sm'>Change to how much you want to borrow</Text>
      <HStack>
        <Text fontSize='2xl'>{currencyFormatter.format(homeLoan.loanAmount ?? 0)}</Text>
        <Box ml='-2'>
          <Select 
            size='sm'
            mt='2'
            w='32'
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
        </Box>
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
  )
}

export const LoanDepositInput = () => {
  const { homeLoan, updateValue } = useHomeLoanCalculator()

  return (
    <Box w='full'>
      <Heading fontSize='xl'>Your Deposit</Heading>
      <Text fontSize='sm'>Change to what you have</Text>
      <HStack>
        <Text fontSize='2xl'>{currencyFormatter.format(homeLoan.loanDeposit ?? 0)}</Text>
        <Text mt='2' fontSize='md'>{percentageFormatter(homeLoan.loanDepositPerc ?? 0)} of loan</Text>
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
  )
}



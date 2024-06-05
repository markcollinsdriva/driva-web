'use client'

import { Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Input, Slider, SliderTrack, SliderThumb, SliderFilledTrack, Container, FormErrorMessage, FormHelperText, Text, HStack, Button } from '@chakra-ui/react'

import { NumericFormat } from 'react-number-format'
import { useEffect, useState } from 'react'

export default function Page() {

return (
  <Container maxW="md">
    <Tabs>
      <TabList>
          <Tab>Option A</Tab>
          <Tab>Option B</Tab>
          <Tab>Option C</Tab>
          <Tab>Option D</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SliderOption option='a' />
        </TabPanel>
        <TabPanel>
          <SliderOption option='b' />
        </TabPanel>
        <TabPanel>
          <SliderOption option='c' />
        </TabPanel>
        <TabPanel>
          <SliderOption option='d' />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Container>
  )
}

// a = as is
// b = amount cap
// c = %

const STEP_SIZE = 1000
const DEFAULT_LOAN_AMOUNT = 20000
const DEFAULT_MAX_LOAN = 100000
const DEFAULT_MAX_DEPOSIT = 100000



const SliderOption = ({
  option
}: {
  option: 'a'|'b'|'c'|'d'
}) => {
  const [ depositType, setDepositType ] = useState<'$'|'%'>(
    ['a','b'].includes(option) ? '$' : '%'
  )
  const isDeposit$ = depositType === '$'

  const [ loanAmount, setLoanAmount ] = useState(DEFAULT_LOAN_AMOUNT)
  const [ deposit, setDeposit ] = useState(0)
  const [ depositPerc, setDepositPerc ] = useState(0)
  const [ maxDeposit, setMaxDeposit ] = useState(DEFAULT_MAX_DEPOSIT)
  const depositRatio = Math.round(100 * deposit / loanAmount)

  useEffect(() => {
    switch (option) {
      case 'a':
        break;
      case 'b':
        setDeposit(deposit => Math.min(deposit, loanAmount))
        setMaxDeposit(loanAmount)
        break;
      case 'c':
        setDeposit(Math.round(depositPerc * loanAmount / 100))
        break;
      case 'd':
        setDeposit(deposit => {
          return depositType === '$' 
            ? Math.min(deposit, loanAmount)
            : Math.round(depositPerc * loanAmount / 100)
        })
        break;
      default:
        break;
    }
  }, [ deposit, depositPerc, loanAmount, depositType, option])


  return (<>
    <FormControl>
      <FormLabel>Loan amount</FormLabel>
      <NumericFormat 
        value={loanAmount} 
        onValueChange={(values) => setLoanAmount(values.floatValue || 0)}
        prefix={'$'}
        thousandSeparator=','
        allowNegative={false}
        decimalScale={0}
        customInput={Input} />
      <Slider 
        value={loanAmount}
        onChange={(val) => setLoanAmount(val)}
        min={0} 
        max={DEFAULT_MAX_LOAN} 
        step={STEP_SIZE}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </FormControl>

    <FormControl>
      <FormLabel>Deposit</FormLabel> 
      <NumericFormat 
        value={isDeposit$ ? deposit : depositPerc} 
        onValueChange={(values) => isDeposit$ ? setDeposit(values.floatValue || 0) : setDepositPerc(values.floatValue || 0)}
        prefix={depositType == '$' ? '$' : undefined}
        suffix={depositType == '%' ? '%' : undefined}
        thousandSeparator={isDeposit$ ? ',' : undefined} 
        allowNegative={false}
        decimalScale={0}
        customInput={Input} />
      <HStack>
      {isDeposit$ 
        ? <Text my='2'>Your deposit is {depositRatio || 0}% of your loan</Text> 
        : <Text my='2'>Your deposit is ${deposit.toLocaleString()}</Text>}
      {option === 'd' ?
        <Button 
          onClick={() => setDepositType(oldVal => oldVal === '$' ? '%' : '$')}
          variant='ghost' 
          fontSize={12} 
          textDecoration='underline'>
           {!isDeposit$ ? 'Enter exact amount instead' : 'Enter percentage instead'}
        </Button>: null}
      </HStack>
      <Slider 
        value={isDeposit$ ? deposit : depositPerc} 
        onChange={(val) => isDeposit$ ? setDeposit(val) : setDepositPerc(val)}
        min={0} 
        max={isDeposit$ ? maxDeposit : 100} 
        step={isDeposit$ ? STEP_SIZE : 1}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </FormControl>
    </>)
}


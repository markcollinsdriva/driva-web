'use client'

import { useForm, Controller, UseFormReturn, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, FormLabel, FormControl, FormErrorMessage, Button, Heading, VStack, Input, Select} from '@chakra-ui/react'
import * as z from 'zod'
import { LOAN_AMOUNT_DEFAULT, LOAN_TERM_DEFAULT, loanAmountZod, LoanTermEnum, loanTermZodEnum, LoanType, ProductNameEnum, productNameZodEnum, Products, VehicleConditionEnum, vehicleConditionZodEnum, vehicleYearZod } from '@/app/credit-score/config'
import { useLoanApplication } from '@/app/credit-score/hooks/useLoanApplication'
import { useCreditScore } from '@/app/credit-score/hooks/useCreditScore'
import { useRedirectIfNoAuth } from '@/app/credit-score/hooks/useRedirectIfNoAuth'
import { getQuoteAndRedirect } from '@/app/credit-score/getQuoteAndRedirect'
import { HeaderLogo } from '@/app/credit-score/components/HeaderLogo'
import { CurrencyInput } from '@/components/CurrencyInput'
import { ToggleButtons } from '@/components/ToggleButtons'

export const loanApplicationFormZod = z.object({
  productName: productNameZodEnum,
  loanAmount: loanAmountZod,
  loanTerm: loanTermZodEnum,
  vehicleYear: vehicleYearZod.optional(),
  vehicleCondition: vehicleConditionZodEnum.optional()
}).refine(data => {
  if (data.productName !== 'CarPurchase') return true
  return data.vehicleYear !== null && data.vehicleCondition !== null
}, {
  message: 'Vehicle Year and Vehicle Condition are required for Car Purchase',
})

type FormValues = {
  productName: ProductNameEnum|undefined
  loanAmount: number
  loanTerm: LoanTermEnum
  vehicleCondition: VehicleConditionEnum|undefined
  vehicleYear: number|undefined
}

type FormReturn = UseFormReturn<FormValues, undefined>

export default function Page() {
  const { isChecking } = useRedirectIfNoAuth()

  const [
    profile,
    creditScore
  ] = useCreditScore(store => [
    store.profile,
    store.score
  ])

  const [ 
    product,
    utmCampaign,
    utmMedium,
    utmSource
  ] = useLoanApplication(store => [ 
    store.product,
    store.utmCampaign,
    store.utmMedium,
    store.utmSource
  ])

  console.log('product', product)

  const formReturn: FormReturn = useForm<FormValues>({
    resolver: zodResolver(loanApplicationFormZod),
    defaultValues: {
      productName: product?.name || undefined,
      loanAmount: LOAN_AMOUNT_DEFAULT,
      loanTerm: LOAN_TERM_DEFAULT as LoanTermEnum,
      vehicleCondition: undefined as VehicleConditionEnum|undefined,
      vehicleYear: undefined as number|undefined,
    }
  })

  const {
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting, errors }
  } = formReturn

  console.log('errors', errors)

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data)
    try {
      if (!product) {
        throw new Error('Product not found') 
      }

      await getQuoteAndRedirect({
        productName: product.name as ProductNameEnum,
        profile,
        loanAmount: data.loanAmount,
        loanTerm: data.loanTerm,
        vehicleYear: data.vehicleYear,
        vehicleCondition: data.vehicleCondition,
        utmSource: utmSource ?? 'newsletter',
        utmMedium: utmMedium ?? 'organic',
        utmCampaign: utmCampaign ?? 'credit-re-engagement-au',
        creditScore: creditScore ? Number(creditScore) : null,
      })
    } catch (e) {
      let error = e instanceof Error ? e : new Error('Unknown error')
      setError('root', {
        message: error.message,
      })
    }
  }

  if (!product || isChecking) return null

  const isVehicleLoan = product.loanType === LoanType.Vehicle
  const showVehicleYear = isVehicleLoan && watch('vehicleCondition') === 'used'
  const showVehicleCondition = isVehicleLoan

  return (
    <Container maxW='sm' mt='4'>
      <HeaderLogo />
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} alignItems="start">
          <Heading fontSize='24'>We just need a few details</Heading>
          {showVehicleCondition && <VehicleConditionForm formReturn={formReturn}/>}
          {showVehicleYear && <VehicleYearForm formReturn={formReturn} />}
          <LoanAmountForm formReturn={formReturn}/>
          <LoanTermForm formReturn={formReturn}/>
          
          <Button w='full' isLoading={isSubmitting} type='submit'>
            Get Quote
          </Button>
          {errors?.root && <div>{errors.root.message}</div>}
        </VStack>
      </form>
    </Container>
  )
}

const VehicleConditionForm = ({ formReturn}: { formReturn: FormReturn }) => {
  const { control, formState: { errors} } = formReturn

  return (
    <FormControl isInvalid={!!errors.vehicleCondition}>
      <FormLabel htmlFor='vehicleCondition'>Vehicle Condition</FormLabel>
      <Controller 
        control={control}
        name='vehicleCondition'
        render={({ field }) => (
          <ToggleButtons 
            onChange={option => field.onChange(option.value)} 
            getLabel={option => option.label}
            getIsSelected={option => option.value === field.value}
            options={[
              { value: 'new', label: 'New' },
              { value: 'used', label: 'Used' }
            ]}
          />)
        }
      />
      <FormErrorMessage>
        {errors.vehicleCondition?.message?.toString()}
      </FormErrorMessage>
    </FormControl>
  )
}


const VehicleYearForm = ({ formReturn}: { formReturn: FormReturn }) => {
  const { control, formState: { errors} } = formReturn

  return (
    <FormControl isInvalid={!!errors.vehicleYear}>
      <FormLabel htmlFor='vehicleYear'>Car Year</FormLabel>
      <Controller
        control={control}
        name='vehicleYear'
        render={({ field }) => (
          <Input 
            {...field}  
            onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
        )}
      />
      <FormErrorMessage>
        {errors.vehicleYear?.message?.toString()}
      </FormErrorMessage>
    </FormControl>
  )
}

const LoanAmountForm = ({ formReturn}: { formReturn: FormReturn }) => {
  const { control, formState: { errors} } = formReturn

  return (
    <FormControl isInvalid={!!errors.loanAmount}>
      <FormLabel htmlFor='loanAmount'>Loan Amount</FormLabel>
      <Controller 
        control={control}
        name='loanAmount'
        render={({ field }) => (
        <CurrencyInput value={field.value} onValueChange={field.onChange} />
      )}
      />
      <FormErrorMessage>
        {errors.loanAmount?.message?.toString()}
      </FormErrorMessage>
    </FormControl>
  )
}

const loanTermOptions = [
  { value: 2, label: '2 years' },
  { value: 3, label: '3 years' },
  { value: 5, label: '5 years' },
  { value: 7, label: '7 years' }
]

const LoanTermForm = ({ formReturn}: { formReturn: FormReturn }) => {
  const { control, formState: { errors} } = formReturn

 return (
  <FormControl isInvalid={!!errors.loanTerm}>
    <FormLabel htmlFor='loanTerm'>Loan Term</FormLabel>
    <Controller
      control={control}
      name='loanTerm'
      render={({ field }) => (
        <Select 
          {...field}>
          {loanTermOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select> 
      )}
    />
    <FormErrorMessage>
      {errors.loanTerm?.message?.toString()}
    </FormErrorMessage>
  </FormControl>
 )
}

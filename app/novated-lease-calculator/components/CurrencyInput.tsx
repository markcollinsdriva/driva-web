
'use client'

import { Input } from '@chakra-ui/react'
import { NumericFormat } from 'react-number-format'

export const CurrencyInput = ({
  value,
  onChange
}: {
  value: number|null
  onChange: (value?: number) => unknown
}) => {

  return <NumericFormat 
    value={value} 
    onValueChange={(values) => onChange(values.floatValue)}
    allowNegative={false}
    prefix={'$'}
    thousandSeparator=','
    decimalScale={0}
    customInput={Input} />
}


  
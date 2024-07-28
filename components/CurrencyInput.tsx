
'use client'

import { Input } from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { NumericFormat } from 'react-number-format'

export const CurrencyInput = ({
  value,
  onValueChange,
  onChange,
}: {
  value: number|null
  onValueChange?: (value?: number) => unknown
  onChange?: (event: ChangeEvent<HTMLInputElement>) => unknown
}) => {

  return <NumericFormat 
    value={value} 
    onValueChange={(values) => onValueChange && onValueChange(values.floatValue)}
    onChange={onChange}
    allowNegative={false}
    prefix={'$'}
    thousandSeparator=','
    decimalScale={0}
    customInput={Input} />
}


  
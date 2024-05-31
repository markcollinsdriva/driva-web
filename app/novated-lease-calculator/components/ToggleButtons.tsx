'use client'

import { Button, ButtonGroup, VStack } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'

export const ToggleButtons = <T,>({
  options,
  onChange,
  getLabel,
  getIsSelected,
  numPerRow = 2
}: {
  options: T[]
  onChange: (option: T) => void,
  getLabel: (option: T) => string,
  getIsSelected: (option: T) => boolean,
  numPerRow?: number
}) => {
  const optionsChunks = chunkMaxLength(options, numPerRow)

  return (
    <VStack alignItems='start'>
      <SimpleGrid columns={numPerRow} spacing={5} w='full'>
        {options.map((option, idx) => (
        <Button 
          key={idx}
          variant={getIsSelected(option) ? 'solid' : 'outline'}
          onClick={() => onChange(option)}>
          {getLabel(option)}
        </Button> 
      ))}
      </SimpleGrid>
    </VStack>
  )
}

const chunkMaxLength = <T,>(arr: T[], chunkSize: number, maxLength?: number) => {
  const _arr = [...arr]
  const length = maxLength ? maxLength : Math.ceil(arr.length / chunkSize)
  return Array.from({ length }, () => _arr.splice(0, chunkSize))
}
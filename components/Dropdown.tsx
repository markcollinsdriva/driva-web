'use client'

import { Select } from "@chakra-ui/react"

interface DropdownOption {
  value: string|number
  label: string
}

export const Dropdown = <T extends DropdownOption>({ 
  onChange,
  placeholder = 'Select option',
  options 
}: {
  onChange: (option: T) => void,
  placeholder?: string,
  options: T[]
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(options.find(option => option.value === e.target.value) as T)
  }

  return (
    <Select 
      onChange={handleChange}
      placeholder={placeholder}>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </Select> 
  )
}


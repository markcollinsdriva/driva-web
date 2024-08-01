export const dateOfBirthAsString = ({ day, month, year }: { day: number, month: number, year: number }) => {
    const date = `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`
    return date
}
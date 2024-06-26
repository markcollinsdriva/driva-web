import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import LoanAmountCalculator from '@/app/calculator/components/LoanAmountCalculator'
import RepaymentCalculator from '@/app/calculator/components/RepaymentCalculator'

export default function Page() {

return (
  <Tabs>
    <TabList>
        <Tab>What can I afford?</Tab>
        <Tab>My repayments</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <LoanAmountCalculator />
      </TabPanel>
      <TabPanel>
        <RepaymentCalculator />
      </TabPanel>
    </TabPanels>
  </Tabs>
  )
}



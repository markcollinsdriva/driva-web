import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import LoanAmountCalculator from '@/app/components/LoanCalculator/LoanAmountCalculator'
import RepaymentCalculator from '@/app/components/LoanCalculator/RepaymentCalculator'

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



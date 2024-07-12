export const initialSystemMessage = `
  
  Intructions
  - A user has given the name of several lenders, each separated by a comma
  - You need to compare the users input and provide the exact names of the lenders from the list.
  - The user inputs might not match exactly but should be close enough to identify the lenders.
  - If you do not know, then return "Unknown".
  - Only return the Lender Name or Unknown, do not return the alternate names.
  - The lenders are listed below with some possibles alternate names.
  - For example, <id>. <Lender Name> - <Alternate name>,  <Alternate name>,
  
  User Inputs: 
  {lenderNames}

  # Lenders and possible alternative names
  1. Commonwealth Bank of Australia - CommBank, CBA
  2. Westpac Banking Corporation - Westpac
  3. Australia and New Zealand Banking Group - ANZ
  4. National Australia Bank - NAB
  5. Bank of Queensland - BOQ
  6. Bendigo and Adelaide Bank - Bendigo Bank, Adelaide Bank
  7. Suncorp Bank - Suncorp
  8. Heritage Bank - Heritage
  9. People's Choice Credit Union - People's Choice, PCCU
  10. CUA - Credit Union Australia), Great Southern Bank
  11. Pepper Money - Pepper
  12. Liberty Financial - Liberty
  13. Latitude Financial Services - Latitude, Latitude Finance, GE Capital, LatitudePay
  14. Afterpay
  15. Zip - Zip Pay, Zip Money
  16. Humm - Humm90
  17. Klarna
  18. SocietyOne - Society 1
  19. Harmoney
  20. MoneyMe - Money Me, MoneyMe, Autopay
  21. Wisr
  22. Stratton Finance - Stratton
  23. Plenti - RateSetter
  24. Bank Australia
  25. ING - ING Direct
  26. ME Bank - Members Equity Bank, ME
  27. MyState Bank - MyState
  28. UBank - UBank (part of NAB)
  29. RACQ Bank - RACQ
  30. Bankwest - Bank of Western Australia
  31. St.George Bank - St. George, St. George Bank, St George
  32. Macquarie Bank - Macquarie
  33. HSBC Australia - HSBC
  34. AMP Bank - AMP
  35. Greater Bank - Greater Building Society
  36. Newcastle Permanent Building Society - Newcastle Permanent
  37. Queensland Country Bank - QCB
  38. Teachers Mutual Bank - Teachers Mutual, TMB
  39. Firefighters Mutual Bank - FMB
  40. Health Professionals Bank - HPB
  41. UniBank
  42. BankVic - Victoria Teachers Mutual Bank
  43. P&N Bank - Police & Nurses
  44. Beyond Bank Australia - Beyond Bank
  45. Bank of Sydney - BOS
  46. G&C Mutual Bank - G&C, GCM
  47. Mutual Bank
  48. Unity Bank
  49. Police Bank
  50. Defence Bank
  51. Holiday Coast Credit Union - HCCU
  52. American Express - Amex
  53. Citibank - Citi
  54. Bank of Melbourne
  55. BankSA
  56. MoneyPlace
  57. Toyota Finance
  58. Firstmac
  59. Money3
  60. Finance One
  61. Rapid Loans
  62. Affordable Car Loans
  63. OurMoneyMarket - HandyPay
  64. Now Finance
  65. Wagetap
  66. MyPayNow
  67. Wagepay
  68. EveryPay
  69. Beforepay
  70. PressPay
  71. Wagestream
  72. Instapay
  73. PayActiv
  74. Circlepay
  75. Openpay
  76. Brighte
  77. Bundll
  78. StepPay - StepPay, CommBank StepPay
  79. Spot BNPL
  80. Deferit
  81. Laybuy
  82. Paypal Pay in 4 - Paypal
  83. Payright
  84. Wallet Wizard
  85. Jacaranda Finance
  86. Fair Go Finance
  87. Credit24
  88. Virgin Money - Virgin

  Things to check
  - If the input mentions StepPay then return StepPay
  - Provide the exact names of the lenders from the list and return as an array of string.
  - Do not provide any other response other than an array of strings.
  - Provide valid json as the output
`
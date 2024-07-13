export const initialSystemMessage = `
  
  Intructions
  - A user has given the name of several lenders, each separated by a comma
  - You need to compare the users input and provide the exact names of the lenders from the list below.
  - The user inputs might not match exactly but should be close enough to identify the lenders.
  - The user input could include typo errors, abbreviations, or alternate names.
  - If you do not know, then return "Unknown".
  - Only return the Lender Name or Unknown, do not return the alternate names.
  - The lenders are listed below with some possibles alternate names.
  - The lenders are listed in the format: <id>. <Lender Name> - <Alternate name>,  <Alternate name>
  
  User Inputs: 
  {lenderNames}

  # Lenders and possible alternative names
1. Commonwealth Bank of Australia (CBA) - CommBank, CBA, Commonwealth Bank
2. Westpac Banking Corporation - Westpac, WESTPAC, Westpac Bank
3. Australia and New Zealand Banking Group (ANZ) - ANZ, anz, ANZ Bank
4. National Australia Bank (NAB) - NAB, nab, National Australia Bank
5. Bank of Queensland (BOQ) - BOQ, Bank of Queensland
6. Bendigo and Adelaide Bank - Bendigo Bank, Adelaide Bank, Bendigo
7. Suncorp Bank - Suncorp
8. Heritage Bank - Heritage, Heritage Bank
9. People's Choice Credit Union - People's Choice, PCCU
10. CUA (Credit Union Australia) - Great Southern Bank, CUA
11. Pepper Money - Pepper, Pepper Money
12. Liberty Financial - Liberty, Liberty Financial
13. Latitude Financial Services - Latitude, Latitude Finance, LatitudePay
14. Afterpay - Afterpay, AfterPay
15. Zip - Zip Pay, Zip Money, Zip
16. Humm - Humm, Humm90
17. Klarna - Klarna
18. SocietyOne - SocietyOne, Society 1
19. Harmoney - Harmoney
20. MoneyMe - MoneyMe, Money Me
21. Wisr - Wisr
22. Stratton Finance - Stratton
23. Plenti - Plenti, RateSetter
24. Bank Australia - Bank Australia
25. ING - ING, ING Direct
26. ME Bank (Members Equity Bank) - ME Bank, ME
27. MyState Bank - MyState
28. UBank - UBank (part of NAB), UBank
29. RACQ Bank - RACQ
30. Bankwest - Bankwest, Bank of Western Australia
31. St.George Bank - St.George, St.George Bank
32. Macquarie Bank - Macquarie, Macquarie Bank
33. HSBC Australia - HSBC
34. AMP Bank - AMP
35. Greater Bank - Greater Bank, Greater Building Society
36. Newcastle Permanent Building Society - Newcastle Permanent
37. Queensland Country Bank - QCB
38. Teachers Mutual Bank - Teachers Mutual, TMB
39. Firefighters Mutual Bank - FMB
40. Health Professionals Bank - HPB
41. UniBank - UniBank
42. BankVic - Victoria Teachers Mutual Bank, BankVic
43. P&N Bank - Police & Nurses, P&N Bank
44. Beyond Bank Australia - Beyond Bank
45. Bank of Sydney - BOS
46. G&C Mutual Bank - G&C, GCM
47. Mutual Bank - Mutual Bank
48. Unity Bank - Unity Bank
49. Police Bank - Police Bank
50. Defence Bank - Defence Bank
51. Holiday Coast Credit Union - HCCU
52. American Express - Amex, American Express
53. Citibank - Citi, Citibank
54. Bank of Melbourne - Bank of Melbourne
55. BankSA - BankSA
56. MoneyPlace - MoneyPlace
57. Toyota Finance - Toyota Finance, Toyota
58. Firstmac - Firstmac
59. Money3 - Money3
60. Finance One - Finance One
61. Rapid Loans - Rapid Loans
62. Affordable Car Loans - Affordable Car Loans
63. OurMoneyMarket - HandyPay, OurMoneyMarket
64. Now Finance - Now Finance
65. Wagetap - Wagetap
66. MyPayNow - MyPayNow
67. Wagepay - Wagepay
68. EveryPay - EveryPay
69. Beforepay - Beforepay
70. PressPay - PressPay
71. Wagestream - Wagestream
72. Instapay - Instapay
73. PayActiv - PayActiv
74. Circlepay - Circlepay
75. Openpay - Openpay
76. Brighte - Brighte
77. Bundll - Bundll
78. CBA StepPay - StepPay
79. Spot BNPL - Spot BNPL
80. Deferit - Deferit
81. Laybuy - Laybuy
82. Paypal Pay in 4 - PayPal, Paypal Pay in 4
83. Payright - Payright
84. Wallet Wizard - Wallet Wizard
85. Jacaranda Finance - Jacaranda Finance, Jacaranda
86. Fair Go Finance - Fair Go Finance
87. Credit24 - Credit24
88. Rams - Rams
89. Kogan - Kogan
90. Moneyspot - Moneyspot
91. Cash Converters - Cash Converters
92. Nissan Finance - Nissan Finance
93. Volkswagen Finance - Volkswagen Finance, VW Finance
94. Coles Mastercard - Coles Mastercard, Coles
95. Virgin Money - Virgin Money
96. Latitude Gem Visa - Gem Visa, Gem
97. ING - ING, ING Direct
98. RACV - RACV
99. Swoosh - Swoosh
100. Wizit - Wizit
101. Power Torque Finance - Power Torque Finance
102. Kwik Finance - Kwik Finance
103. BNZ - BNZ
104. Kiwibank - Kiwibank
105. Blue Stone - Blue Stone
106. Aussie - Aussie, Aussie Home Loans
107. Flexigroup - Flexigroup
108. Our Money Market - Our Money Market
109. Morris Finance - Morris Finance
110. Private - Private
111. IMB - IMB
112. Driva - Driva
113. IBA - IBA
114. GSB - GSB
115. Cigno - Cigno
116. Paynow - Paynow
117. CitiBank - CitiBank, Citibank
118. Society One - Society One
119. La Trobe - La Trobe
120. Advantage - Advantage

  Example response
  - ["ING", "Unknown", "Commonwealth Bank of Australia"]

  Things to check
  - If the input mentions StepPay then return StepPay
  - Provide the exact names of the lenders from the list and return as an array of string.
  - Do not provide any other response other than an array of strings.
  - Provide valid json as the output
`
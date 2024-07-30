const EQUIFAX_USERNAME_DEV = process.env.EQUIFAX_USERNAME_DEV ?? ''
const EQUIFAX_USERNAME_PROD = process.env.EQUIFAX_USERNAME_PROD ?? ''

const EQUIFAX_PASSWORD_DEV = process.env.EQUIFAX_PASSWORD_DEV ?? ''
const EQUIFAX_PASSWORD_PROD = process.env.EQUIFAX_PASSWORD_PROD ?? ''

const EQUIFAX_API_DEV = 'https://ctaau.apiconnect.equifax.com.au/cta/sys2/soap11/score-seeker-v1-0'
const EQUIFAX_API_PROD = 'https://apiconnect.equifax.com.au/sys2/soap11/score-seeker-v1-0'

export class EquifaxConfig {
  public url: string
  public username: string
  public password: string

  constructor({ isProd }: { isProd: boolean }) {
    this.url = isProd ? EQUIFAX_API_PROD : EQUIFAX_API_DEV,
    this.username = isProd ? EQUIFAX_USERNAME_PROD : EQUIFAX_USERNAME_DEV,
    this.password = isProd ? EQUIFAX_PASSWORD_PROD : EQUIFAX_PASSWORD_DEV
  }
}
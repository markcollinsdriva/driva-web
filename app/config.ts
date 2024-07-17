export enum ENV {
  PROD = 'prod',
  DEV = 'dev'
}

export const IS_PROD = process.env.NODE_ENV === 'production'

export const CURRENT_ENV = IS_PROD ? ENV.PROD : ENV.DEV
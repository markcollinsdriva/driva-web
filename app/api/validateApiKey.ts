import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'


export const validateApiKey = (headersList: ReadonlyHeaders) => {
  const apiKey = headersList.get('x-api-key')
  if (apiKey !== process.env.X_API_KEY) throw new Error('Invalid API key')
}

import { NextRequest, NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { JsonOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { initialSystemMessage } from './prompt'

const prompt = ChatPromptTemplate.fromTemplate(initialSystemMessage)
const parser = new JsonOutputParser()
const model = new ChatOpenAI({
  temperature: 0,
	apiKey:  process.env.OPENAI_API_KEY,
	model: 'gpt-4o',
})

const chain = RunnableSequence.from([ prompt, model, parser ])

export async function GET(request: NextRequest) {
  let data = null
  let errorMessage: string|null = null
  let status = 200

  try {
    const searchParams = request.nextUrl.searchParams
    const lenderNamesAsString = searchParams.get('names') 
    if (!lenderNamesAsString) {
      status = 400
      throw new Error('No lender names')
    }
    const names = lenderNamesAsString.split(',')
    const suggestedLenders = await chain.invoke({ lenderNames: lenderNamesAsString })
    if (!Array.isArray(suggestedLenders)) {
      status = 500
      throw new Error('Reponse invalid')
    }
    data = { names, suggestedLenders }
  } catch (error) {
    errorMessage = (error instanceof Error ? error.message : 'unknown error')
  } finally {
    return NextResponse.json({ data, error: errorMessage }, { status })
  }
}

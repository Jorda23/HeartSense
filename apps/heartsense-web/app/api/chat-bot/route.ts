import { NextRequest, NextResponse } from 'next/server'
import { ChatBotResponse } from '@/protos/generated/ChatService/ChatBotResponse'
import { ChatBotRequest } from '@/protos/generated/ChatService/ChatBotRequest'
import { grpcClients } from '../client/grpcClient'

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const requestBody: ChatBotRequest = await req.json()

    return await new Promise((resolve) => {
      const responses: ChatBotResponse[] = []

      const call = grpcClients.openAIChat.ChatConversation(requestBody)

      call.on('data', (response: ChatBotResponse) => {
        responses.push(response)
      })

      call.on('end', () => {
        resolve(NextResponse.json({ messages: responses }, { status: 200 }))
      })

      call.on('error', (error: any) => {
        console.error('[ChatBot API] gRPC error:', error)
        resolve(
          NextResponse.json(
            { error: 'gRPC Streaming Error', details: error.message },
            { status: 500 }
          )
        )
      })
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

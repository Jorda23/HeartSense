import { NextRequest, NextResponse } from 'next/server'
import { UpdateConversationResponse } from '@/protos/generated/ChatService/UpdateConversationResponse'
import { UpdateConversationRequest } from '@/protos/generated/ChatService/UpdateConversationRequest'
import { grpcClients } from '../client/grpcClient'

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const requestBody: UpdateConversationRequest = await req.json()

    return await new Promise((resolve) => {
      grpcClients.openAIChat.UpdateConversation(
        requestBody,
        (error: any, response: UpdateConversationResponse) => {
          if (error) {
            console.error('[NewChat API] gRPC error:', error)

            resolve(
              NextResponse.json(
                { error: 'gRPC Error', details: error.message },
                { status: 500 }
              )
            )
          } else {
            resolve(NextResponse.json(response, { status: 200 }))
          }
        }
      )
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

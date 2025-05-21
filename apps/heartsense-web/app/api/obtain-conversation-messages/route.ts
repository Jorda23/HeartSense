import { NextRequest } from 'next/server'
import { handleGrpcCall } from '@/helpers/grpcRequestHandler'
import {
  parseCommonOperation,
  parseCommonFilters,
} from '@/helpers/parseUrlParams'
import { grpcClients } from '../client/grpcClient'

export async function GET(req: NextRequest): Promise<Response> {
  return handleGrpcCall(
    req,
    (url) => ({
      user_id: url.searchParams.get('user_id'),
      conversation_id: url.searchParams.get('conversation_id'),
      operation: parseCommonOperation(url),
      filters: parseCommonFilters(url),
    }),
    grpcClients.openAIChat.ObtainConversationMessages.bind(
      grpcClients.openAIChat
    ),
    'MessageHistory API'
  )
}

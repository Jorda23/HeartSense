import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const PROTO_PATHS = {
  ChatService: path.join(process.cwd(), 'protos', 'ChatService.proto'),
}

const loadProto = (protoPath: string) => {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })

  return grpc.loadPackageDefinition(packageDefinition)
}

const grpcProtos = {
  ChatService: loadProto(PROTO_PATHS.ChatService),
}

export const grpcClients = {
  openAIChat: new (
    grpcProtos.ChatService as any
  ).ChatService.ConversationService(
    process.env.GRPC_QUESTIONSOLVINGAGENT_TARGET,
    grpc.credentials.createInsecure()
  ),
}

import { notFound } from 'next/navigation'
import { Chat } from '@/components/common/Chat'
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models'
import { obtainConversationMessagesService } from '@/service/obtain-conversation-messages/obtainConversationMessagesService'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import { convertToUIMessages } from '@/helpers'

interface DecodedToken {
  nameid: string
  email: string
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params
  const messagesFromDb = await obtainConversationMessagesService(id)

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error('No token found in cookies')
  }

  const decoded = jwtDecode<DecodedToken>(token)

  const user = {
    id: decoded.nameid,
    email: decoded.email,
  }
  if (!messagesFromDb) {
    notFound()
  }

  return (
    <Chat
      id={id}
      initialMessages={convertToUIMessages(messagesFromDb.messages)}
      selectedChatModel={DEFAULT_CHAT_MODEL}
      isReadonly={false}
      user={user}
    />
  )
}

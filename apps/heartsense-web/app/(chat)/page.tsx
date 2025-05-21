import { Chat } from '@/components/common/Chat/Chat'
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models'
import { generateUUID } from '@/lib/utils'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  nameid: string
  email: string
}

export default async function Page() {
  const id = generateUUID()

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

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      selectedChatModel={DEFAULT_CHAT_MODEL}
      isReadonly={false}
      user={user}
    />
  )
}

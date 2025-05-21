export interface LoginPayload {
  email: string
  password: string
}

export const loginService = async (
  payload: LoginPayload
): Promise<{ token: string }> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Login failed')
  }

  return res.json()
}

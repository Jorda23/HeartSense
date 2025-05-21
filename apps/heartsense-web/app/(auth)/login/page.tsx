'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginService } from '@/service/loginService/loginService'
import { LoaderIcon } from '@/public/Icons'
import Image from 'next/image'

function SubmitButton({
  loading,
  disabled,
}: {
  loading: boolean
  disabled: boolean
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`mt-4 w-full rounded-md px-4 py-2 text-white font-semibold transition-colors ${
        loading || disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-emerald-600 hover:bg-emerald-700'
      } relative`}
    >
      Sign in
      {loading && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin">
          <LoaderIcon />
        </span>
      )}
    </button>
  )
}

function AuthForm({
  onSubmit,
  loading,
}: {
  onSubmit: (formData: FormData) => void
  loading: boolean
}) {
  const [emailValid, setEmailValid] = useState(true)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pattern = /^[\w.-]+@[\w.-]+\.\w{2,}$/
    setEmailValid(pattern.test(e.target.value))
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        onSubmit(formData)
      }}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          placeholder="user@acme.com"
          onChange={handleEmailChange}
          required
          className={`w-full px-4 py-2 border ${
            emailValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          autoComplete="email"
        />
        {!emailValid && (
          <span className="text-sm text-red-500">Invalid email format</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          autoComplete="current-password"
        />
      </div>

      <SubmitButton loading={loading} disabled={!emailValid} />
    </form>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    startTransition(async () => {
      setError(null)
      try {
        const result = await loginService({ email, password })
        document.cookie = `token=${result.token}; path=/; SameSite=Lax`
        router.push('/dashboard')
      } catch (err: any) {
        if (err?.message?.includes('credentials')) {
          setError('Invalid email or password.')
        } else if (err?.message?.includes('fetch')) {
          setError('Could not connect to server.')
        } else {
          setError('Unexpected error. Please try again later.')
        }
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="App Logo"
            width={96}
            height={96}
            className="mx-auto"
            priority
          />
          <h2 className="text-2xl font-bold text-gray-600">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-gray-500">
            Utilice su email y contraseña para iniciar sesión
          </p>
        </div>

        <AuthForm onSubmit={handleSubmit} loading={isPending} />

        {error && (
          <div className="text-red-600 text-sm text-center mt-2 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/register"
            className="text-emerald-600 font-medium hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

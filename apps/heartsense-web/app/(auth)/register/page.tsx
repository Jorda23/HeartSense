'use client'

import { LoaderIcon } from '@/public/Icons'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

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
      Crear cuenta
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
  children,
  defaultEmail = '',
  loading,
}: {
  onSubmit: (formData: FormData) => void
  children: React.ReactNode
  defaultEmail?: string
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
          id="email"
          name="email"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          defaultValue={defaultEmail}
          onChange={handleEmailChange}
          required
          className={`w-full px-4 py-2 border ${
            emailValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500`}
        />
        {!emailValid && (
          <span className="text-sm text-red-500">
            Formato de correo inválido
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <SubmitButton loading={loading} disabled={!emailValid} />

      {children}
    </form>
  )
}

export default function Page() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRegister = (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('Email y contraseña son requeridos.')
      return
    }

    startTransition(async () => {
      setError(null)
      try {
        const response = await fetch(
          'http://localhost:5273/api/auth/register',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al registrarse')
        }

        router.push('/login')
      } catch (err: any) {
        if (err.message.includes('already in use')) {
          setError('Este correo ya está registrado.')
        } else if (err.message.includes('fetch')) {
          setError('No se pudo conectar al servidor.')
        } else {
          setError('Ocurrió un error inesperado.')
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
          <h2 className="text-2xl font-bold text-gray-600 mt-2">
            Crea una cuenta
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Utiliza tu correo y contraseña para crear una cuenta
          </p>
        </div>

        <AuthForm onSubmit={handleRegister} loading={isPending}>
          {error && (
            <div className="text-red-600 text-sm text-center mt-2 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="text-emerald-600 font-medium hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </AuthForm>
      </div>
    </div>
  )
}

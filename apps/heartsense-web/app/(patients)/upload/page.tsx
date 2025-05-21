import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { Toaster } from 'react-hot-toast'

import UploadDropzone from '@/components/common/UploadDropzone/UploadDropzone'

interface DecodedToken {
  nameid: string
  email: string
}

export default async function UploadPatientPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error('No token found in cookies')
  }

  const decoded = jwtDecode<DecodedToken>(token)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Subir archivo de paciente
      </h1>
      <UploadDropzone id={decoded.nameid} email={decoded.email} />
      <Toaster position="top-center" />
    </div>
  )
}

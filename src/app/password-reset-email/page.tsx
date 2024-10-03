'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AuthService } from '@/services/auth-service'
import { em } from 'framer-motion/client'
import { useRouter } from 'next/navigation'
import ModalPasswordResetEmail from '@/components/modal-password-reset-email'

const authService: AuthService = AuthService.getInstnacie()

export default function PasswordResetEmailPage() {
  // Se definen los estados del componente
  // Se obtiene el enrrutador de navegación
  const router = useRouter()

  // Funciones Service

  async function findUserWithEmail(email: string): Promise<void> {
    // se realiza la solicitud de obteneción del usuario por su email
    try {
      const idUser = await authService.findUserWithEmail(email)
      // si no ocurrió ningún error
      // se le envía un código de verificación al usuario
      await authService.sendVerificationCode(idUser)
      // se redirige a la página de verificación de identidad
      router.push('/verification-code/' + idUser)
    } catch (error) {
      if (error instanceof Error)
        alert(error.message)

      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Reset Password
          </motion.h1>
        </motion.div>

        <ModalPasswordResetEmail findUserWithEmail={findUserWithEmail} />

        <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  )
}
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ModalLogin from '@/components/modal-login'
import Link from 'next/link'
import { AuthService } from '@/services/auth-service'
import { useRouter } from 'next/navigation'

const authService: AuthService = AuthService.getInstnacie()

export default function LoginPage() {
  // se definen los estados del componente
  const router = useRouter() // se obtiene el enrrutador de navegación


  // Funciones Service
  async function login(userName: string, password: string) {
    // se realiza la petición del login
    try {
      const idUsuario: string | undefined = await authService.login(userName, password)
      // si el método retorno el indentificador del usuario significa que el usuario necesita activar su cuenta
      if (idUsuario) {
        router.push('/activation-code/' + idUsuario) // se redirige a la página del código de activación
      }
      else { // si no, entonces el login fue realizado con éxito
        router.push('/administration-panel')
      }

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
        console.log(error)
      }
    }
  }

  function forgotPassword() {
    // se redirige a la página de identificación de cuenta por email
    router.push('/password-reset-email')
  }

  async function sendActivationCode(idUser: string) {
    // se realiza la solicitud de envio de correo eléctronico
    try {
      await authService.sendVerificationCode(idUser)
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
            Welcome Back
          </motion.h1>
        </motion.div>

        <ModalLogin forgotPassword={forgotPassword} login={login} />
        <p className="mt-8 text-center text-sm text-gray-600">
          You don't have an account?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500" > Create Account Here </Link>
        </p>

      </div>
    </div>
  )
}

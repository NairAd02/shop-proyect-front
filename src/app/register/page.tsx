'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AuthService } from '@/services/auth-service'
import { RolEnum } from '@/utils/enums'
import { useRouter } from 'next/navigation'
import ModalRegistrer from '@/components/modal-registrer'
import Link from 'next/link'

const authService: AuthService = AuthService.getInstnacie()

export default function RegisterPage() {

  const router = useRouter()
  // funciones 
  async function register(userName: string, password: string, email: string) {
    // se realiza la solicitud de registro
    try {
      await authService.registrer(userName, password, email, RolEnum.Cliente /* por defecto cuando se ejecuta un registro por esta pantalla el rol será de cliente */)
      // se notifica de la acción al usuario
      alert("Successful registration process")
      // se vuelve a rederigir al login
      router.push('/login')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
        console.log(error)
      }
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
            Join Us
          </motion.h1>
        </motion.div>

        <ModalRegistrer register={register} />
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
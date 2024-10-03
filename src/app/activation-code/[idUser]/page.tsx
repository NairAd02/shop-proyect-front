'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import ModalActivationCode from '@/components/modal-activation-code'
import { AuthService } from '@/services/auth-service'
import { useRouter } from 'next/navigation'

const authService: AuthService = AuthService.getInstnacie()

export default function VerifyIdentityPage({ params }: { params: { idUser: string } }) {
    // Se definen los estados del componente
    // Se obtiene el enrrutador de navegación
    const router = useRouter()


    // funciones

    async function sendActivationCode() {
        // se realiza la solicitud de envio de correo eléctronico
        try {
            await authService.sendVerificationCode(params.idUser)
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)
            console.log(error)
        }
    }

    async function verifyIdentity(code: string) {
        // se realiza la solicitud de verificación del código de
        try {
            console.log(params.idUser)
            await authService.activateAccount(params.idUser, code)
            alert("Successfully verified account")
            // se redirige al usuario al Login
            router.push('/login')
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
                        Verify Your Identity
                    </motion.h1>
                </motion.div>

                <ModalActivationCode sendActivationCode={sendActivationCode} verifyIdentity={verifyIdentity} />

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 flex items-center justify-center">
                        <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                        Check your spam folder if you don't see the email in your inbox
                    </p>
                </div>
            </div>
        </div>
    )
}
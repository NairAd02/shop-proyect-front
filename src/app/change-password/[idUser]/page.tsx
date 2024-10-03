'use client'

import ModalChangePassword from '@/components/modal-change-password'
import { AuthService } from '@/services/auth-service'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


const authService: AuthService = AuthService.getInstnacie()

export default function ChangePasswordPage({ params }: { params: { idUser: string } }) {
    // Se definen los estados del componente
    // Se obtiene el enrrutador de navegación
    const router = useRouter()

    // Funciones Services

    async function changePassword(newPassword: string): Promise<void> {
        // Se realiza la solicitud para el cambio de contraseña
        try {
            await authService.changePassword(params.idUser, newPassword)
            // se notifica de la acción al usuario
            alert("Cambio de contraseña ejecutado con éxito. Por favor vuelva a logearse")
            // se redirige al login
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
                        Change Password
                    </motion.h1>
                </motion.div>
                <ModalChangePassword changePassword={changePassword} />
                <p className="mt-8 text-center text-sm text-gray-600">
                    Remember your current password?{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Go back to login
                    </Link>
                </p>
            </div>
        </div>
    )
}
"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'

export default function ModalActivationCode(props: {
    verifyIdentity: (code: string) => Promise<void>
    sendActivationCode: () => Promise<void>
}) {

    const [verificationCode, setVerificationCode] = useState('')
    const [error, setError] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    // estado para indicar la carga del botón de enviar código de verificación
    const [isLoading, setLoading] = useState(false /* en principio se indica que no se está cargando */)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationCode(e.target.value)
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!verificationCode.trim()) {
            setError('Please enter the verification code')
            return
        }

        // Se indica un estado de carga por verificación
        setIsVerifying(true)
        await props.verifyIdentity(verificationCode) // se envía el código de activación
        // se finaliza el estado de carga por verificación
        setIsVerifying(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-lg p-8"
        >
            <div className="flex justify-center mb-8">
                <Shield className="h-12 w-12 text-indigo-600" />
            </div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Check Your Email
                </h2>
                <p className="text-gray-600">
                    We've sent a verification code to your email address. Please check your inbox and enter the code below.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                        Verification Code
                    </label>
                    <Input
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        required
                        className="mt-1"
                        placeholder="Enter your verification code"
                        value={verificationCode}
                        onChange={handleChange}
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                <div>
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isLoading || isVerifying}
                    >
                        {isLoading ? 'Sending...' : isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                </div>
            </form>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <Button variant={'outline'} onClick={async () => {
                        // enviar el código de verificación pone en un estado de carga al modal
                        setLoading(true)
                        await props.sendActivationCode() // se envía el código de verificación
                        // luego que se envia el código el estado de carga ha finalizado
                        setLoading(false)
                    }} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Resend code
                    </Button>
                </p>
            </div>
        </motion.div>
    )
}

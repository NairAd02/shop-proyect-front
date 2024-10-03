"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ModalLogin(props: {
    login: (userName: string, password: string) => Promise<void>
    forgotPassword: () => void
}) {
    // Se definen lso estados del componente
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    // define el estado de carga del componente
    const [isLoading, setLoading] = useState(false /* por defecto el componente no se encuentra en un estado de carga */)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // se indica un estado de carga
        setLoading(true)
        await props.login(userName, password)
        // una vez terminado el estado del logeo, se finaliza dicho estado de carga
        setLoading(false)
    }
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-lg p-8"
        >
            <div className="flex justify-center mb-8">
                <ShoppingBag className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
                Sign in to your account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <Input
                        id="userName"
                        name="userName"
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                        className="mt-1"
                        placeholder="Enter your user name"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        className="mt-1"
                        placeholder="Enter your password"
                    />
                </div>
                <div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isLoading ? 'Login....' : 'Login'}
                    </Button>
                </div>
            </form>
            <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => {
                    props.forgotPassword()
                }} className="text-sm text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                </Button>
            </div>
        </motion.div>
    )
}

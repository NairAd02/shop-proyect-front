"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
export default function ModalRegistrer(props: {
    register: (userName: string, password: string, email: string) => Promise<void>
}) {

    // Se definen los estados del componente
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
    })

    // define el estado de carga del componente
    const [isLoading, setLoading] = useState(false /* por defecto el componente no se encuentra en un estado de carga */)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Basic validation
        let newErrors = { username: '', email: '', password: '' }
        let isValid = true

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
            isValid = false
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
            isValid = false
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        setErrors(newErrors)

        if (isValid) { // si todos los campos son válidos
            // se define un estado de carga para la acción del registro
            setLoading(true)
            await props.register(formData.username, formData.password, formData.email)
            // una vez terminado el registro se finaliza el estado de carga
            setLoading(false)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-lg p-8"
        >
            <div className="flex justify-center mb-8">
                <UserPlus className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
                Create your account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="mt-1"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="mt-1"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="mt-1"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                <div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isLoading ? 'Register....' : 'Register'}
                    </Button>
                </div>
            </form>
        </motion.div>
    )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function ModalChangePassword(props: {
    changePassword: (newPassword: string) => Promise<void>
}) {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isChanging, setIsChanging] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Validation
        let newErrors = { newPassword: '', confirmPassword: '' }
        let isValid = true

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required'
            isValid = false
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long'
            isValid = false
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password'
            isValid = false
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)

        // si el formulario es válido
        if (isValid) {
            // se indica el estado de carga
            setIsChanging(true)
            await props.changePassword(formData.newPassword) // se ejecuta el cambio de contraseña
            // Una vez se terminó de procesar la solicitud se finaliza el estado de carga
            setIsChanging(false)
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
                <Lock className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
                Enter Your New Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="mt-1 relative">
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            className="pr-10"
                            placeholder="Enter your new password"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                    </label>
                    <div className="mt-1 relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            className="pr-10"
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
                <div>
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isChanging}
                    >
                        {isChanging ? 'Changing Password...' : 'Change Password'}
                    </Button>
                </div>
            </form>
        </motion.div>
    )
}

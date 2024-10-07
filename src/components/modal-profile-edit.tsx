'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from 'lucide-react'

export default function ModalProfileEdit(props: {
    isOpen: boolean
    changeStateModal: (state: boolean) => void
}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // These would typically come from your user context or props
    const userRole = "Usuario"
    const userEmail = "usuario@ejemplo.com"
    const userAvatarUrl = "/placeholder.svg?height=200&width=200" // Placeholder avatar URL

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the updated data to your backend
        console.log('Submitting:', { username, password })
        props.changeStateModal(false) // se cierra el modal
    }

    return (
        <>
            <AnimatePresence>
                {props.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[700px] w-full"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Editar Perfil</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => props.changeStateModal(false)}
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
                                    <div className="flex justify-center md:justify-start">
                                        <Avatar className="w-40 h-40">
                                            <AvatarImage src={userAvatarUrl} alt="Avatar del usuario" />
                                            <AvatarFallback>UN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Nombre de Usuario</Label>
                                            <Input
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Ingresa tu nuevo nombre de usuario"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Contraseña</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Ingresa tu nueva contraseña"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rol</Label>
                                            <Input value={userRole} disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={userEmail} disabled />
                                        </div>
                                        <div className="flex justify-end space-x-3 mt-6">
                                            <Button type="button" variant="outline" onClick={() => props.changeStateModal(false)}>
                                                Cancelar
                                            </Button>
                                            <Button type="submit">Guardar Cambios</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
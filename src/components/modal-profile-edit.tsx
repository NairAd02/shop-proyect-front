'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from 'lucide-react'
import { UserDTO } from '@/dto/user/user.dto'
import { UsersService } from '@/services/users-service'
import { toast } from 'sonner'
import ModalChangePasswordProfile from './modal-change-password-profile'

const usersService: UsersService = UsersService.getInstnacie()
export default function ModalProfileEdit(props: {
    isOpen: boolean
    changeStateModal: (state: boolean) => void
}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    // Estado que representa al usuario logeado
    const [userLog, setUserLog] = useState<UserDTO | undefined>(undefined)
    const [isOpenModalChangePasswordProfile, setIsOpenModalChangePasswordProfile] = useState(false) // por defecto el modal se encuentra cerrado

    // Cuando el componente es montado
    useEffect(() => {
        // se solicita la información del usuario logeado
        findUserLog()
    }, [])

    // función para obtener la información del usuario logeado
    async function findUserLog() {
        // se realiza la solicitud de obtención del usuario logeado
        try {
            setUserLog(await usersService.findUserLog())
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }

    // función para actualizar la información del usuario
    async function updateUser(userName: string, password: string) {
        // se realiza la solicitud de actualización
        // solo si el usuario fue encontrado
        if (userLog) {
            try {
                await usersService.updateUser(userLog.id, userName, password)
                // se notifica al usuario de la acción
                toast("The Profile has been update suff ", {
                    description: new Date().toDateString(),
                    action: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                })
            } catch (error) {
                if (error instanceof Error)
                    alert(error.message)

                console.log(error)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Se envio")
        await updateUser(username, password) // se realiza la actualización del usuario
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
                                            <AvatarImage alt="Avatar del usuario" />
                                            <AvatarFallback>User</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">User Name</Label>
                                            <Input
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder={userLog ? userLog.nombreUsuario : ''}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rol</Label>
                                            <Input value={userLog?.rol} disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={userLog?.email} disabled />
                                        </div>
                                        <Button type="button" onClick={() => {
                                            // se activa el modal del cambio de contraseña
                                            setIsOpenModalChangePasswordProfile(true)
                                        }}>Change Password</Button>
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
            <ModalChangePasswordProfile isOpen={isOpenModalChangePasswordProfile} oldPasswordProp={password} idUser={userLog ? userLog.id : ''} changeStateModal={(state: boolean) => {
                setIsOpenModalChangePasswordProfile(state) // se cambia el estado del modal
            }} changePassword={(password: string) => {
                // se actualiza la contraseña
                setPassword(password)
            }} />
        </>
    )
}
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { AuthService } from '@/services/auth-service'
import { toast } from 'sonner'

interface PasswordChangeModalProps {
    isOpen: boolean
    oldPasswordProp: string
    idUser: string
    changeStateModal: (state: boolean) => void
    changePassword: (password: string) => void
}

const authService: AuthService = AuthService.getInstnacie()

export default function ModalChangePasswordProfile({ isOpen, oldPasswordProp, idUser, changeStateModal, changePassword }: PasswordChangeModalProps) {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Estados para manejar los errores de validación
    const [oldPasswordError, setOldPasswordError] = useState('')
    const [newPasswordError, setNewPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    // cada vez que se cierra o se abre el modal
    useEffect(() => {
        resetCampos()
    }, [isOpen])

    // Función para reiniciar los campos
    function resetCampos() {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setOldPasswordError('')
        setNewPasswordError('')
        setConfirmPassword('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Limpiar los errores antes de validar
        let valid = true
        setOldPasswordError('')
        setNewPasswordError('')
        setConfirmPasswordError('')

        // Validar la longitud de la contraseña anterior
        if (oldPassword.length < 8) {
            setOldPasswordError('La contraseña anterior debe tener al menos 8 caracteres')
            valid = false
        }

        // Validar la longitud de la nueva contraseña
        if (newPassword.length < 8) {
            setNewPasswordError('La nueva contraseña debe tener al menos 8 caracteres')
            valid = false
        }

        // Validar la confirmación de la contraseña
        if (confirmPassword.length < 8) {
            setConfirmPasswordError('La confirmación debe tener al menos 8 caracteres')
            valid = false
        }

        // Si hay algún error, detener el proceso
        if (!valid) return

        // Si no hay errores, continuar con la verificación
        if (await verificarOldPassword()) {
            if (confirmPassword === newPassword) {
                changePassword(newPassword)
                toast("Contraseña Cambiada con éxito", {
                    description: "Recuerde Guardar los cambios para confirmarla. Fecha: " + new Date().toDateString(),
                    action: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                })
                changeStateModal(false)
            } else {
                setConfirmPasswordError("Las contraseñas no coinciden")
            }
        } else {
            setOldPasswordError("La contraseña anterior es incorrecta")
        }
    }

    async function verificarOldPassword(): Promise<boolean> {
        let isValid = false
        if (oldPasswordProp === '') {
            if (await verificarOldPasswordServer()) isValid = true
        } else if (oldPassword === oldPasswordProp) {
            isValid = true
        }
        return isValid
    }

    async function verificarOldPasswordServer(): Promise<boolean> {
        let isEquals = false
        try {
            isEquals = await authService.verificarOldPassword(idUser, oldPassword)
        } catch (error) {
            console.log(error)
        }
        return isEquals
    }

    return (
        <AnimatePresence>
            {isOpen && (
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
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Cambiar Contraseña</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => {
                                    changeStateModal(false)
                                }}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="oldPassword">Contraseña Anterior</Label>
                                <Input
                                    id="oldPassword"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Ingresa tu contraseña actual"
                                    required
                                />
                                {oldPasswordError && <p className="text-red-500 text-sm">{oldPasswordError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Ingresa tu nueva contraseña"
                                    required
                                />
                                {newPasswordError && <p className="text-red-500 text-sm">{newPasswordError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                    required
                                />
                                {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                            </div>
                            { /*<div className="text-right">
                                <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                    ¿Has olvidado la contraseña anterior?
                                </a>
                            </div>*/}
                            <div className="flex justify-end space-x-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => changeStateModal(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">Cambiar Contraseña</Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

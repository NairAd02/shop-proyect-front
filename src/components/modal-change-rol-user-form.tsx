'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { User, X } from 'lucide-react'
import { Label } from './ui/label'
import { CreateProductDTO } from '@/dto/product/create-product.dto'
import { ProductDTO } from '@/dto/product/product.dto'
import { UpdateProductDTO } from '@/dto/product/update-product.dto'
import { Slider } from './ui/slider'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { RolEnum } from '@/utils/enums'
import { UserDTO } from '@/dto/user/user.dto'

interface ModalProductProps {
    isOpen: boolean
    changeStateModal: (state: boolean) => void
    selectedUser: UserDTO | undefined // representa el usuario seleccionado
    updateUser: (idUser: string, rol: RolEnum) => Promise<void>
}


export default function ModalChangeRolUserForm({ isOpen, changeStateModal, selectedUser, updateUser }: ModalProductProps) {
    const [selectedRol, setSelectedRol] = useState<RolEnum | undefined>(undefined)
    // Estado que representa los roles seleccionables
    const [roles] = useState([RolEnum.Administrador, RolEnum.Trabajador, RolEnum.Cliente])
    // Cada vez que se abra o cierre el componente
    useEffect(() => {
        setSelectedRol(selectedUser ? selectedUser.rol : undefined)
    }, [isOpen])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // se solicita la actualización del usuario
        if (selectedUser) {
            if (selectedRol) // si fue seleccioando un rol
                await updateUser(selectedUser.id, selectedRol)
            else
                alert('Es necesario seleccionar un rol')
        }

        changeStateModal(false)
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
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Change the Rol</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => {
                                    changeStateModal(false) // se cierra el modal
                                }}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className='flex flex-row items-center justify-center gap-3' >
                                <Select value={selectedRol} onValueChange={(e) => {
                                    if (e)
                                        setSelectedRol(e as RolEnum)
                                }}>

                                    <SelectTrigger>
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue>
                                                <span className="text-muted-foreground">{selectedRol}</span>
                                            </SelectValue>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Roles</SelectLabel>
                                            {roles.map(rol => <SelectItem key={rol} value={rol}>{rol}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => {
                                    changeStateModal(false) // se cierra el modal
                                }} >
                                    Cancel
                                </Button>
                                <Button type="submit"> Change </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
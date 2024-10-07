'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Menu, X, User } from 'lucide-react'
import { BreadcrumbPanel } from './breadcrumb-panel'
import ItemMenu from './item-menu'
import { IconUserBolt } from '@tabler/icons-react'
import { DropdownMenuItem } from './ui/dropdown-menu'
import { UserDTO } from '@/dto/user/user.dto'
import { getCookie } from '@/utils/token-utilities'
import { UsersService } from '@/services/users-service'
import { AuthService } from '@/services/auth-service'
import { useRouter } from 'next/navigation'
import ModalProfileEdit from './modal-profile-edit'

const usersService: UsersService = UsersService.getInstnacie()
const authService: AuthService = AuthService.getInstnacie()
export default function Header() {
    // se obtiene el enrrutador de navegación
    const router = useRouter()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [userLog, setUserLog] = useState<UserDTO | undefined>(undefined) // representa al usuario logeado
    const [itemMenu, setItemMenu] = useState<ReactNode>()
    const [isOpenModalProfileEdit, setIsOpenModalProfileEdit] = useState(false) // por defecto el modal se encuentra "cerrado"
    // Cuando el componente es montado
    useEffect(() => {
        console.log('Entre al efecto')
        findUserLog()
    }, [])


    // Cuando se obtiene el usuario logeado
    useEffect(() => {
        setItemMenu(<ItemMenu key={1} text={userLog?.nombreUsuario as string} variant={'outline'} icon={<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />} content={[
            <DropdownMenuItem key={1} onClick={() => {
                // se activa el modal para ver el perfil del usuario
                setIsOpenModalProfileEdit(true)
            }} >Ver Perfil</DropdownMenuItem>,
            <DropdownMenuItem key={2} onClick={() => {
                // se cierra la sesión del usuario
                authService.logout()
                // se redirige al login
                router.push('/login')
            }}>Cerrar Sesion</DropdownMenuItem>
        ]} />) // se refresca la información del itemMenu
    }, [userLog])

    // Funciones Service
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
    return (
        <header className="bg-white shadow-md">
            <ModalProfileEdit isOpen={isOpenModalProfileEdit} changeStateModal={(state: boolean) => {
                // se le cambia el estado al modal
                setIsOpenModalProfileEdit(state)
            }} />
            <div className="p-4">
                <div className="flex justify-between items-center py-4 h-[30px]">
                    <div className="flex items-center">
                        <button
                            className="sm:hidden mr-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6 text-gray-500" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-500" />
                            )}
                        </button>
                        <BreadcrumbPanel />
                    </div>
                    <div className="hidden sm:flex items-center justify-center space-x-4">
                        <motion.div
                            initial={false}
                            animate={{ width: isSearchOpen ? 'auto' : '40px' }}
                            className="relative"
                        >

                        </motion.div>
                        {itemMenu}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="sm:hidden bg-white border-t"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {itemMenu}
                    </div>
                </motion.div>
            )}
        </header>
    )
}
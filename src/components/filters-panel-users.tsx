import { div } from 'framer-motion/client'
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Input } from './ui/input'
import ItemMenu from './item-menu'
import { IconUserBolt } from '@tabler/icons-react'
import { Slider } from './ui/slider'
import { RolEnum } from '@/utils/enums'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { User, X } from 'lucide-react'

export interface FiltersUsers {
    userName: string,
    email: string
    rol: RolEnum | undefined
}

// Se definen las exposiciones del componente
export type FiltersPanelUsersHandle = {
    filters: FiltersUsers
};
export const FiltersPanelUsers = forwardRef((props: {
    findUsers: (userName: string, email: string, rol: RolEnum | undefined) => Promise<void>
}, ref: ForwardedRef<unknown>) => {
    // se especifica cuales serán las propiedades que expondrá el componente
    useImperativeHandle(ref, () => ({
        filters // se exponen los valores de los filtros
    }));
    // Se definen los estados del componente
    const [filters, setFilters] = useState<FiltersUsers>({
        userName: '',
        email: '',
        rol: undefined
    })
    // Estado que representa los roles seleccionables
    const [roles] = useState([RolEnum.SuperAdministrador, RolEnum.Administrador, RolEnum.Trabajador, RolEnum.Cliente])

    // Cada vez que el valor de los filtros cambia
    useEffect(() => {
        // se actualiza la informaición de la tabla de los usuarios
        props.findUsers(filters.userName, filters.email, filters.rol)
    }, [filters])
    return (
        <div className='flex flex-row gap-2' >
            <Input
                placeholder="Filter name..."
                className="max-w-sm"
                value={filters.userName}
                onChange={(e) => {
                    setFilters({
                        ...filters,
                        userName: e.target.value
                    })
                }}
            />
            <Input
                placeholder="Filter Email..."
                className="max-w-sm"
                value={filters.email}
                onChange={(e) => {
                    setFilters({
                        ...filters,
                        email: e.target.value
                    })
                }}
            />
            <div className='flex flex-row items-center justify-center gap-3' >
                <Select value={filters.rol} onValueChange={(e) => {
                    if (e)
                        setFilters({
                            ...filters,
                            rol: e as RolEnum
                        })
                }}>

                    <SelectTrigger>
                        <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select a role" >
                                {filters.rol ? filters.rol : <span className="text-muted-foreground">Select a role</span>}
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
                {filters.rol && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => {
                            // se limpia el campo de rol
                            setFilters({
                                ...filters,
                                rol: undefined
                            })
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
})


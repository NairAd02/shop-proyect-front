"use client"


import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useEffect, useRef, useState } from "react"
import { UserDTO } from "@/dto/user/user.dto"
import { FiltersPanelUsers, FiltersPanelUsersHandle } from "./filters-panel-users"
import { RolEnum } from "@/utils/enums"
import { UsersService } from "@/services/users-service"
import { toast } from "sonner"
import { ModalAlert } from "./modal-alert"
import ModalChangeRolUserForm from "./modal-change-rol-user-form"
import { AuthService } from "@/services/auth-service"


// se inyecta el servicio de los productos
const usersService: UsersService = UsersService.getInstnacie()
// se inyecta el servicio de auth
const authService: AuthService = AuthService.getInstnacie()
export function UsersTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    // Estado que representa si el modal alerta está activo o no
    const [isOpenModalAlerta, setIsOpenModalAlerta] = useState(false) // por defecto el modal se encuentra cerrado
    // Estado que representa si el modal para el cambio de rol está activo o no
    const [isOpenModalChangeRol, setIsModalChangeRol] = useState(false) // por defecto el modal se encuentra cerrado
    // estado que representa los datos de los usuarios
    const [users, setUsers] = useState(new Array<UserDTO>())
    // estado que representa al usuario seleccionado
    const [selectedUser, setSelectedUser] = useState<UserDTO | undefined>(undefined)
    const [isDelete, setIsDelete] = useState(true)
    // estado que representa el rol del usuario logeado
    const [userRolLog, setUserRolLog] = useState(getUserRolLog())
    const refFiltersPanelUsers = useRef<FiltersPanelUsersHandle>()
    // Cuando se monta el componente
    useEffect(() => {
        // se cargan los datos de los productos
        actualizarUsers()
    }, [])

    async function actualizarUsers() {
        if (refFiltersPanelUsers.current) {
            // se obtiene la propiedad de los filtros
            const filters = refFiltersPanelUsers.current.filters
            await findUsers(filters.userName, filters.email, filters.rol)
        }
    }

    // Funciones Services
    // función para obtener el rol del usuario logeado
    function getUserRolLog(): RolEnum | undefined {
        try {
            return authService.getRolToken()
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
            return undefined
        }
    }
    async function findUsers(userName: string, email: string, rol: RolEnum | undefined) {
        // Se realiza la solicitud de obtención de los productos
        try {
            setUsers(await usersService.findUsers(userName !== '' ? userName : undefined, email !== '' ? email : undefined, rol))
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }

    // función para eliminar los usuarios seleccionados
    async function deleteUsers() {
        // se obtienen los productos seleccionados
        const selectedUsers = table.getSelectedRowModel().rows.map(user => user.original.id)
        // se realiza la solicitud de eliminación
        try {
            await usersService.deleteUsers(selectedUsers)
            // si no ocurre nigún error
            // se notifica de la acción al usuario
            toast("Delete Suffe", {
                description: new Date().toDateString(),
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
            // se actualiza la información de los usuarios en la tabla
            await actualizarUsers()
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }

    // función para actualizar la información de un usuario en específico

    // función para eliminar los usuarios seleccionados
    async function updateUser(idUser: string, rol: RolEnum) {
        // se realiza la solicitud de actualización
        try {
            await usersService.updateUser(idUser, undefined, undefined, rol)
            // si no ocurre nigún error
            // se notifica de la acción al usuario
            toast("The User has been update suff ", {
                description: new Date().toDateString(),
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
            // se actualiza la información de los usuarios en la tabla
            await actualizarUsers()
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }

    const columns: ColumnDef<UserDTO>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "nombreUsuario",
            header: "User Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("nombreUsuario")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "rol",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Rol
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("rol")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                            >
                                <Button onClick={() => {
                                    // se cambia el usuario seleccionado
                                    setSelectedUser(row.original)
                                    // se activa el modal para el cambio de rol
                                    setIsModalChangeRol(true)
                                }} >Change Rol</Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(payment.id)}
                            >
                                Copy payment ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Cada vez que cambian las filas seleccionadas
    useEffect(() => {
        setIsDelete(table.getSelectedRowModel().rows.length === 0)
    }, [table.getSelectedRowModel().rows])

    return (
        <div className="w-full">
            <ModalChangeRolUserForm isOpen={isOpenModalChangeRol} changeStateModal={(state: boolean) => {
                // se le cambia el estado al modal
                setIsModalChangeRol(state)
            }} selectedUser={selectedUser} updateUser={updateUser} />
            <ModalAlert isOpen={isOpenModalAlerta} changeModal={(state: boolean) => {
                setIsOpenModalAlerta(state)
            }} action={deleteUsers} text="Are you sure?" description="Are you Sure?" />
            <div className="flex items-center justify-between py-4">
                <FiltersPanelUsers ref={refFiltersPanelUsers} findUsers={findUsers} />
                <div className="flex gap-3">
                    {userRolLog === RolEnum.SuperAdministrador ? <Button variant={"destructive"} disabled={isDelete} onClick={() => {
                        // se activa el modal de alerta
                        setIsOpenModalAlerta(true)
                    }} >Delete</Button> : <></>}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

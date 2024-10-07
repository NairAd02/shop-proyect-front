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
import { ProductDTO } from "@/dto/product/product.dto"
import { useEffect, useRef, useState } from "react"
import { ProductsService } from "@/services/products-service"
import { FiltersPanelProducts, FiltersPanelProductsHandle } from "./filters-panel-products"
import ModalProduct from "./modal-product"
import { CreateProductDTO } from "@/dto/product/create-product.dto"
import { toast } from "sonner"
import { ModalAlert } from "./modal-alert"
import { UpdateProductDTO } from "@/dto/product/update-product.dto"


// se inyecta el servicio de los productos
const productsService: ProductsService = ProductsService.getInstnacie()

export function ProductsTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    // estado que representa los datos de los productos
    const [products, setProducts] = useState(new Array<ProductDTO>())
    const [isDelete, setIsDelete] = useState(true)
    const refFiltersPanelProducts = useRef<FiltersPanelProductsHandle>()
    // Estado del modal de los productos
    const [isModalProductOpen, setIsModalProductOpen] = useState(false) // por defecto el modal se encuentra cerrado
    // Estado del modal de alerta
    const [isOpenModalAlerta, setIsOpenModalAlerta] = useState(false)
    // Estado para representar al producto seleccionado
    const [selectedProduct, setSelectProduct] = useState<ProductDTO | undefined>(undefined)
    // Cuando se monta el componente
    useEffect(() => {
        // se cargan los datos de los productos
        actualizarProducts()
    }, [])

    async function actualizarProducts() {
        if (refFiltersPanelProducts.current) {
            // se obtiene la propiedad de los filtros
            const filters = refFiltersPanelProducts.current.filters
            await findProducts(filters.name, filters.price[0], filters.discount[0], filters.priceDiscount[0], filters.averageReview[0])
        }
    }

    // Funciones Services
    async function findProducts(name: string, price: number, discount: number, preciodiscount: number, averageReview: number) {
        // Se realiza la solicitud de obtención de los productos
        try {
            setProducts(await productsService.findProducts(name !== '' ? name : undefined,
                price > 0 ? price : undefined, discount > 0 ? discount / 100 /* se lleva a porciento */ : undefined, preciodiscount > 0 ? preciodiscount : undefined,
                averageReview > 0 ? averageReview : undefined))
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }

    // función para eliminar los productos seleccionados
    async function deleteProducts() {
        // se obtienen los productos seleccionados
        const selectedProducts = table.getSelectedRowModel().rows.map(product => product.original.id)
        // se realiza la solicitud de eliminación
        try {
            await productsService.removeAll(selectedProducts)
            // si no ocurre nigún error
            // se notifica de la acción al usuario
            toast("Delete Suffe", {
                description: new Date().toDateString(),
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
            // se actualiza la información de los productos en la tablas
            await actualizarProducts()
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }

    // función para insertar un producto
    async function createProduct(createProductDTO: CreateProductDTO) {
        // se realiza la solicitud de insercción del producto
        try {
            await productsService.createProduct(createProductDTO)
            // si no ocurrió ningún error
            // se notifica de la acción al usuario
            toast("The product " + createProductDTO.name + " has been create ", {
                description: new Date().toDateString(),
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
            // se actualiza la información de los productos
            await actualizarProducts()
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }

    // Función para actualizar la información de un producto en específico
    async function updateProduct(idProduct: string, updateProductDTO: UpdateProductDTO) {
        // se realiza la solicitud de actualización del producto
        try {
            await productsService.updateProduct(idProduct, updateProductDTO)
            // si no ocurrió ningún error
            // se notifica de la acción al usuario
            toast("The product has been update suff ", {
                description: new Date().toDateString(),
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
            // se actualiza la información de los productos
            await actualizarProducts()
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)

            console.log(error)
        }
    }


    const columns: ColumnDef<ProductDTO>[] = [
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
            accessorKey: "name",
            header: "name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
        },
        {
            accessorKey: "discount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Discount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("discount")}</div>,
        },
        {
            accessorKey: "preciodiscount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price Discount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("preciodiscount")}</div>,
        },
        {
            accessorKey: "averageReview",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Average Review
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("averageReview")}</div>,
        },
        {
            accessorKey: "photoURL",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Image
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("photoURL")}</div>,
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
                                    // se selecciona el producto a modificar
                                    setSelectProduct(row.original)
                                    setIsModalProductOpen(true) //se activa el modal
                                }} >Update Info</Button>
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
        data: products,
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
            <ModalProduct isOpen={isModalProductOpen} changeStateModal={(state) => {
                setIsModalProductOpen(state) // se actualiza el estado del modal
            }} createProduct={createProduct} updateProduct={updateProduct} selectedProduct={selectedProduct} />
            <ModalAlert isOpen={isOpenModalAlerta} changeModal={(state: boolean) => {
                setIsOpenModalAlerta(state)
            }} action={deleteProducts} text="Are you sure?" description="Are you Sure?" />
            <div className="flex items-center justify-between py-4">
                <FiltersPanelProducts ref={refFiltersPanelProducts} findProducts={findProducts} />
                <div className="flex gap-3">
                    <Button onClick={() => {
                        // se marca que no se ha seleccionado para modificar ningún producto
                        setSelectProduct(undefined)
                        setIsModalProductOpen(true) // se activa el modal
                    }} >Add</Button>
                    <Button variant={"destructive"} disabled={isDelete} onClick={() => {
                        // se activa el modal de alerta
                        setIsOpenModalAlerta(true)
                    }} >Delete</Button>
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

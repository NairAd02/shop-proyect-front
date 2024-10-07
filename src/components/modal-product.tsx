'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Label } from './ui/label'
import { CreateProductDTO } from '@/dto/product/create-product.dto'
import { ProductDTO } from '@/dto/product/product.dto'
import { UpdateProductDTO } from '@/dto/product/update-product.dto'
import { Slider } from './ui/slider'

interface ModalProductProps {
    isOpen: boolean
    changeStateModal: (state: boolean) => void
    createProduct: (createProductDTO: CreateProductDTO) => Promise<void>
    updateProduct: (idProduct: string, updateProductDTO: UpdateProductDTO) => Promise<void>
    selectedProduct: ProductDTO | undefined // representa el producto seleccionado
}


export default function ModalProduct({ isOpen, changeStateModal, createProduct, selectedProduct, updateProduct }: ModalProductProps) {
    const [productData, setProductData] = useState({
        name: '',
        price: 0,
        discount: [0],
        photoURL: '',
    })

    // Cada vez que se abra o cierre el componente
    useEffect(() => {
        resetCampos()
    }, [isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProductData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'discount' ? parseFloat(value) || 0 : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // si fue abierto como modo insercción
        if (!selectedProduct)
            // se realiza la petición de insercción
            await createProduct(new CreateProductDTO(productData.name, productData.price,
                productData.discount[0] / 100 /* se lleva a porciento */, productData.photoURL))
        else // si fue abierto como modo actualización
            await updateProduct(selectedProduct.id, new UpdateProductDTO(productData.name, productData.price,
                productData.discount[0] / 100 /* se lleva a porciento */, productData.photoURL))
        // se limpian los campos
        resetCampos()
        // se cierra el modal
        changeStateModal(false)
    }

    function resetCampos() {
        setProductData(!selectedProduct ? {
            name: '',
            price: 0,
            discount: [0],
            photoURL: '',
        } : {
            name: selectedProduct.name,
            price: selectedProduct.price,
            discount: [selectedProduct.discount * 100 /* se lleva a porciento */],
            photoURL: selectedProduct.photoURL,
        })
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
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{!selectedProduct ? 'Add New Product' : 'Update The Product '}</h2>
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
                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={productData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="discount">Discount</Label>
                                <Slider
                                    defaultValue={[0]}
                                    max={100}
                                    step={1}
                                   
                                    value={productData.discount}
                                    onValueChange={(newValues: number[]) => {
                                        setProductData({
                                            ...productData,
                                            discount: newValues
                                        })
                                    }}
                                />
                                <span>Porcent: {productData.discount[0]}</span>
                            </div>
                            <div>
                                <Label htmlFor="photoURL">Photo URL</Label>
                                <Input
                                    id="photoURL"
                                    name="photoURL"
                                    value={productData.photoURL}
                                    onChange={handleChange}
                                    placeholder="Enter photo URL"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <Button type="button" variant="outline" onClick={() => {
                                    changeStateModal(false) // se cierra el modal
                                }} >
                                    Cancel
                                </Button>
                                <Button type="submit"> {!selectedProduct ? 'Add Product' : 'Update Product'} </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
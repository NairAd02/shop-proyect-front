import { div } from 'framer-motion/client'
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Input } from './ui/input'
import ItemMenu from './item-menu'
import { IconUserBolt } from '@tabler/icons-react'
import { Slider } from './ui/slider'

export interface FiltersProducts {
    name: string,
    price: Array<number>,
    discount: Array<number>,
    priceDiscount: Array<number>,
    averageReview: Array<number>,
}

// Se definen las exposiciones del componente
export type FiltersPanelProductsHandle = {
    filters: FiltersProducts
};
export const FiltersPanelProducts = forwardRef((props: {
    findProducts: (name: string, price: number, discount: number, preciodiscount: number, averageReview: number) => Promise<void>
}, ref: ForwardedRef<unknown>) => {
    // se especifica cuales serán las propiedades que expondrá el componente
    useImperativeHandle(ref, () => ({
        filters // se exponen los valores de los filtros
    }));
    // Se definen los estados del componente
    const [filters, setFilters] = useState({
        name: '',
        price: [0],
        discount: [0],
        priceDiscount: [0],
        averageReview: [0],
    })

    // Cada vez que el valor de los filtros cambia
    useEffect(() => {
        // se actualiza la informaición de la tabla de los productos
        props.findProducts(filters.name, filters.price[0], filters.discount[0] / 100 /* se lleva a porciento */, filters.priceDiscount[0], filters.averageReview[0])
    }, [filters])
    return (
        <div className='flex flex-row gap-2' >
            <Input
                placeholder="Filter name..."
                className="max-w-sm"
                value={filters.name}
                onChange={(e) => {
                    setFilters({
                        ...filters,
                        name: e.target.value
                    })
                }}
            />
            <ItemMenu text='filters' variant={'outline'} icon={<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />}
                content={
                    [
                        <div className='flex flex-col gap-6' key={0}>
                            <div key={1} className="flex flex-col gap-4">
                                <h4 className="font-medium leading-none">Price Range</h4>
                                <Slider
                                    defaultValue={[0]}
                                    max={100}
                                    step={1}
                                    className="w-[250px]"
                                    value={filters.price}
                                    onValueChange={(newValues: number[]) => {
                                        setFilters({
                                            ...filters,
                                            price: newValues
                                        })
                                    }}
                                />
                                <span>Value: {filters.price[0]}</span>
                            </div>
                            <div key={2} className="flex flex-col gap-4">
                                <h4 className="font-medium leading-none">Discount Range</h4>
                                <Slider
                                    defaultValue={[0]}
                                    max={100}
                                    step={1}
                                    className="w-[250px]"
                                    value={filters.discount}
                                    onValueChange={(newValues: number[]) => {
                                        setFilters({
                                            ...filters,
                                            discount: newValues
                                        })
                                    }}
                                />
                                <span>Value: {filters.discount[0]}</span>
                            </div>
                            <div key={3} className="flex flex-col gap-4">
                                <h4 className="font-medium leading-none">Price Discount</h4>
                                <Slider
                                    defaultValue={[0]}
                                    max={100}
                                    step={1}
                                    className="w-[250px]"
                                    value={filters.priceDiscount}
                                    onValueChange={(newValues: number[]) => {
                                        setFilters({
                                            ...filters,
                                            priceDiscount: newValues
                                        })
                                    }}
                                />
                                <span>Value: {filters.priceDiscount[0]}</span>
                            </div>
                            <div key={4} className="flex flex-col gap-4">
                                <h4 className="font-medium leading-none">Average Review</h4>
                                <Slider
                                    defaultValue={[0]}
                                    max={100}
                                    step={1}
                                    className="w-[250px]"
                                    value={filters.averageReview}
                                    onValueChange={(newValues: number[]) => {
                                        setFilters({
                                            ...filters,
                                            averageReview: newValues
                                        })
                                    }}
                                />
                                <span>Value: {filters.averageReview[0]}</span>
                            </div>
                        </div>
                    ]
                } />
        </div>
    )
})


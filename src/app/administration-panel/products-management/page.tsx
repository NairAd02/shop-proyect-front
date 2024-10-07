'use client'
import { ProductsTable } from '@/components/products-table'
import { useAuth } from '@/hooks/useAuth'
import { div } from 'framer-motion/client'
import React, { useState } from 'react'

export default function ProductsManagement() {
    const [isActive, setIsActive] = useState(false)
    // se protege la página
    useAuth(() => {
        setIsActive(true) // si se completó la verificación entonces se muesta la página
    })
    return (
        <>
            {isActive ? <div>
                <ProductsTable />
            </div> : 'Loading...'}
        </>
    )
}

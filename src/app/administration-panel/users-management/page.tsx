'use client'
import { UsersTable } from '@/components/users-table'
import { useAuth } from '@/hooks/useAuth'
import React, { useState } from 'react'

export default function UserManagementPage() {
    const [isActive, setIsActive] = useState(false)
    // se protege la página
    useAuth(() => {
        setIsActive(true) // si se completó la verificación entonces se muesta la página
    })
    return (
        <>
            {isActive ? <div>
                <UsersTable />
            </div> : 'Loaging...'}
        </>
    )
}

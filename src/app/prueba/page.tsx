"use client"
import { useAuth } from '@/hooks/useAuth'

import React, { useEffect } from 'react'

export default function PagePrueba() {
   useAuth()
    return (
        <div>page</div>
    )
}

import React, { ReactNode } from 'react'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from './ui/navigation-menu'
import { Button } from './ui/button'
import { Icon } from '@tabler/icons-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { BreadcrumbEllipsis } from './ui/breadcrumb'
import { ChevronDown } from 'lucide-react'

export default function ItemMenu(props: {
    text: string
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
    icon: ReactNode
    content: Array<ReactNode>
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
               
               
                    <Button variant={props.variant}> {props.icon} {props.text} <ChevronDown className="ml-2 h-4 w-4" /></Button>
         
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className='p-3' >
                {props.content}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

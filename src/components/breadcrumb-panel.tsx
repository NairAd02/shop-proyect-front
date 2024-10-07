import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useEffect, useState } from "react";

import { findRoutesInDescomposePath, Route } from "@/routes/routes";
import { div } from "framer-motion/client";


export function BreadcrumbPanel() {
  // se obtiene el estado de la ruta actual
  const path = usePathname()
  const [routes, setRoutes] = useState(new Array<Route>())

  // Cada vez que cambiar el path name de la ruta
  useEffect(() => {
    setRoutes(findRoutesInDescomposePath(path.split('/').filter(Boolean)))
  }, [path])
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {routes.map((route, index) => {
          if (index !== routes.length - 1) // mientras no sea el último elemento de la lista
            return (<div key={index} className="flex flex-row justify-center items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink href={route.path}>{route.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </div>)
          else
            return (<BreadcrumbItem key={index}>
              <BreadcrumbPage>{route.name}</BreadcrumbPage>
            </BreadcrumbItem>)
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

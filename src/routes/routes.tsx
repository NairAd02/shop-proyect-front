import { IconUserBolt } from "@tabler/icons-react"
import { ReactNode } from "react"

export interface Route {
    path: string,
    name: string // representa el nombre por el que va a ser conocido la ruta
    icon?: ReactNode
    fatherRoute?: string // representa el padre de la ruta
    needAuth: boolean // indica si la ruta necesita que el usuario esté logeado
}

export const routes: Array<Route> = [
    {
        path: '/home',
        name: 'Home',
        needAuth: false
    },
    {
        path: '/prueba',
        name: 'Prueba',
        needAuth: true
    },
    {
        path: '/administration-panel',
        fatherRoute: '/administration-panel',
        icon: (<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
        name: 'Administration Panel',
        needAuth: true
    },
    {
        path: '/administration-panel/users-management',
        fatherRoute: '/administration-panel',
        icon: (<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
        name: 'Users Management',
        needAuth: true
    },
    {
        path: '/administration-panel/products-management',
        fatherRoute: '/administration-panel',
        icon: (<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
        name: 'Products Management',
        needAuth: true
    }
]


// Función para encontrar una ruta por su path
export function findRoute(path: string) {
    return routes.find(route => route.path === path)
}

// Función para obtener todos los hijos de una ruta en específico
export function findChildrensRoute(path: string) {
    return routes.filter(route => route.fatherRoute === path)
}

// Función para obtener todas las rutas contenidas en un path descompuesto
export function findRoutesInDescomposePath(decomposePath: Array<string>): Array<Route> {
    const routes: Array<Route> = new Array<Route>()
    decomposePath.forEach((path) => {
        const route = findPathPrincipal(path) // se obtiene la ruta representada por ese path
        if (route) // si fue encontrada una ruta cuyo path principal sea ese
            routes.push(route)
    })

    return routes
}

// Función para obtener la ruta cuyo path principal sea específicado
function findPathPrincipal(principalPath: string): Route | undefined {
    let routeReturn: Route | undefined = undefined
    for (let index = 0; index < routes.length && !routeReturn; index++) {
        const route = routes[index];
        // primero se descompone el path de la ruta para obtener su path principal
        const pathRoute = route.path.split('/').filter(Boolean);
        const principalPathRoute = pathRoute[pathRoute.length - 1] // el último path descompuesto representa el "path principal de la ruta"
        // si coincide el path principal de la ruta entonces se encontró la ruta adecuada
        if (principalPath === principalPathRoute)
            routeReturn = route
    }

    return routeReturn
}


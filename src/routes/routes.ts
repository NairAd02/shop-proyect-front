
export interface Route {
    path: string,
    needAuth: boolean // indica si la ruta necesita que el usuario esté logeado
}

export const routes: Array<Route> = [
    {
        path: '/home',
        needAuth: false
    },
    {
        path: '/prueba',
        needAuth: true
    }
]


export function findRoute(path: string) {
    return routes.find(route => route.path === path)
}


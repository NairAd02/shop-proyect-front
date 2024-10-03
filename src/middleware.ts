import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log("Voy hacia " + pathname)

    return NextResponse.next();
}

// Configuración opcional para definir en qué rutas se ejecuta el middleware
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)' // Todas las rutas excepto las de recursos estáticos y API
      ],
};
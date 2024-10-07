import { JWT } from '@/dto/jwt.dto';
import { findRoute } from '@/routes/routes';
import { getCookie } from '@/utils/token-utilities';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';



export function useAuth(activatePage: () => void) {
  const router = useRouter();
  const path = usePathname()
  useEffect(() => {
    // cuando se entra a la página se ejecuta la verificación de autenticación
    console.log("Entre a" + path)


    const route = findRoute(path) // se obtiene la ruta actual
    // se obtiene el token de sesión
    const jwt = getCookie('token')
    // si la ruta es una ruta protegida y el usuario no está logeado
    if (route?.needAuth && !jwt) {
      router.push('/login') // se redirige al usuario al login
    }
    else {
      // se verifican los permisos de roles
      // se activa entonces la página
      activatePage() // se activa la página cuando se completó esta operación "se finalza el estado de carga"
    }

  }, [router]);

}
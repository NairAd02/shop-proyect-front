import { findRoute } from '@/routes/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';


export function useAuth() {
  const router = useRouter();
  const path = usePathname()
  useEffect(() => {
    // cuando se entra a la página se ejecuta la verificación de autenticación
    console.log("Entre a" + path)
    const route = findRoute(path) // se obtiene la ruta actual
    // se verifica si necesita autenticación
    if (route?.needAuth)
      console.log("Necesita autenticación")
    else
      console.log("No necesita autenticación")
  }, []);

}
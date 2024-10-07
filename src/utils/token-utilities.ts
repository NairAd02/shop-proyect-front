import { JWT } from "@/dto/jwt.dto";


export function getCookie(name: string): JWT | undefined /* retorna "undefined si no hay almacenado un token" */ {
    const cookies = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
    return cookies ? JSON.parse(cookies.split('=')[1]) : undefined;
}



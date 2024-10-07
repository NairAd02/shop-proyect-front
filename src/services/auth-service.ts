import { JWT } from "@/dto/jwt.dto"
import { BadRequestInterface } from "@/interfaces/bad-request-interface"
import { RolEnum } from "@/utils/enums"

export class AuthService {
    private static authService: AuthService
    // se aplica el patrón Singlenton
    private constructor() { }

    public static getInstnacie() {
        if (!this.authService) // si no ha sido creada instnacia
            this.authService = new AuthService()

        return this.authService
    }

    // Método para ejecutar un logout
    public async logout() {
        // se elimina la información del token
        document.cookie = 'token=; path=/; max-age=0; secure; samesite=strict';
    }

    // Método para realizar el login
    public async login(userName: string, password: string): Promise<string | undefined> {

        const url = 'http://localHost:3001/auth/login'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombreUsuario: userName,
                contrasena: password
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        else {
            const json: JWT | { idUsuario: string } = await res.json()
            if ('idUsuario' in json) // si la respusta contiene el identificador del usuario
                return json.idUsuario
            else {  // en caso contrario se trata del token
                // Almacenar el token en una cookie
                const maxAge = 60 * 60 * 24; // 1 día en segundos
                document.cookie = `token=${JSON.stringify(json)}; path=/; max-age=${maxAge}; secure; samesite=strict`;
            }
        }

        return undefined
    }


    // método para registrar a un usuario
    public async registrer(userName: string, password: string, email: string, rol: RolEnum) {

        const url = 'http://localHost:3001/auth/registrer'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombreUsuario: userName,
                contrasena: password,
                email: email,
                rol: rol
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        const json = await res.json() // se obtiene el json de la respuesta

    }

    // Método para encontrar el id de un usuario dado su email
    public async findUserWithEmail(email: string): Promise<string> {
        const url = 'http://localHost:3001/auth/findUserWithEmail'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        const json: { idUser: string } = await res.json() // se obtiene el json de la respuesta

        return json.idUser // se retorna el identificador del usuario
    }

    // Método para verificar si el código introducido por el usuario es correcto
    public async verifyIdentity(idUser: string, code: string) {
        const url = 'http://localHost:3001/auth/verificarCodigoIdentidad'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario: idUser,
                codigoActivacion: code
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        const json = await res.json() // se obtiene el json de la respuesta
    }

    // Método para activar la cuenta de un usuario
    public async activateAccount(idUser: string, code: string) {
        const url = 'http://localHost:3001/auth/activarCuentaUsuario'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario: idUser,
                codigoActivacion: code
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        const json = await res.json() // se obtiene el json de la respuesta
    }

    // Método para enviar correo eléctronico a un usuario en específico
    public async sendVerificationCode(idUser: string) {
        const url = 'http://localHost:3001/auth/enviarCodigoVerificacionIdentidad/' + idUser
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        const json = await res.json() // se obtiene el json de la respuesta
    }

    // Método para ejecutar el cambio de contraseña de un usuario
    public async changePassword(idUser: string, newPassword: string) {
        const url = 'http://localHost:3001/auth/cambiarContrasena/' + idUser
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newContrasena: newPassword
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        const json = await res.json() // se obtiene el json de la respuesta
    }

}
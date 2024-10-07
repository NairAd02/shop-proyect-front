import { UserDTO } from "@/dto/user/user.dto"
import { BadRequestInterface } from "@/interfaces/bad-request-interface"
import { RolEnum } from "@/utils/enums"
import { getCookie } from "@/utils/token-utilities"

export class UsersService {
    private static usersService: UsersService
    // se aplica el patrón Singlenton
    private constructor() { }

    public static getInstnacie() {
        if (!this.usersService) // si no ha sido creada instnacia
            this.usersService = new UsersService()

        return this.usersService
    }


    // Método para encontrar todos los usuarios
    public async findUsers(userName?: string, email?: string, rol?: RolEnum): Promise<Array<UserDTO>> {
        let users: Array<UserDTO> = new Array<UserDTO>()

        // se obtiene el token de autenticación
        const token = getCookie('token')
        if (token) { // si el usuario se encuentra logeado
            // se definen los parametros query
            const params = new URLSearchParams()
            if (userName) { params.append('nombreUsuario', userName) }
            if (email) { params.append('email', email) }
            if (rol) { params.append('rol', rol) }
            params.append('idSolicitante', token.payload.userId)

            const url = process.env.NEXT_PUBLIC_API_URL + '/usuario/getAllUsers?' + params
            const res: Response = await fetch(url, { // se realiza la peticion al end point
                method: 'GET',
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
            else {
                users = await res.json() // se obtiene la respuesta
            }
        }
        else
            throw new Error('Se necesita autorización')

        return users
    }


    // Método para obtener la información de un usuario
    public async findUser(idUser: string): Promise<UserDTO | undefined> {
        let user: UserDTO | undefined = undefined
        const url = process.env.NEXT_PUBLIC_API_URL + '/usuario/getUsuarioById/' + idUser
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
        else {
            user = await res.json() // se obtiene la respuesta
        }

        return user
    }

    // Método para actualizar la información de un usuario en específico
    public async updateUser(idUser: string /* identificador del usuario a modificar */,
        nombreUsuario?: string,
        contrasena?: string,
        rol?: RolEnum
    ): Promise<void> {

        const url = process.env.NEXT_PUBLIC_API_URL + '/usuario/updateUser/' + idUser
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombreUsuario: nombreUsuario,
                contrasena: contrasena,
                rol: rol
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
    }

    // Método para eliminar todos los usuarios específicados
    public async deleteUsers(usersId: Array<string>): Promise<void> {
        const url = process.env.NEXT_PUBLIC_API_URL + '/usuario/deleteUsers'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listId: usersId /* representa las lista con los identificadores que se van a eliminar  */
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
    }

    // Método para obtener la información del usuario logeado
    public async findUserLog() {
        // se obtiene el token de autenticación
        const token = getCookie('token')
        // si el usuario se encuentra logeado
        if (token) {
            return await this.findUser(token.payload.userId)
        }
        else
            throw new Error('Esta acción necesita de autorización')
    }


}
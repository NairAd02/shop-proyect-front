import { RolEnum } from "@/utils/enums"

export class UserDTO {
    id: string
    nombreUsuario: string
    email: string
    rol: RolEnum

    constructor(
        id: string,
        nombreUsuario: string,
        email: string,
        rol: RolEnum,
    ) {
        this.id = id
        this.nombreUsuario = nombreUsuario
        this.email = email
        this.rol = rol
    }
}
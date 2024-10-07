import { RolEnum } from "@/utils/enums"

export interface JWT {
    token: string
    payload: {
        userId: string,
        rol: RolEnum
    }
}
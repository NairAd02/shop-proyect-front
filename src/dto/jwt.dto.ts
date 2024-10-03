import { RolEnum } from "@/utils/enums"

interface JWT {
    token: string
    payload: {
        userId: string,
        rol: RolEnum
    }
}
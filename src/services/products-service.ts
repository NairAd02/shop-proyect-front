import { CreateProductDTO } from "@/dto/product/create-product.dto"
import { ProductDTO } from "@/dto/product/product.dto"
import { UpdateProductDTO } from "@/dto/product/update-product.dto"
import { UserDTO } from "@/dto/user/user.dto"
import { BadRequestInterface } from "@/interfaces/bad-request-interface"
import { getCookie } from "@/utils/token-utilities"

export class ProductsService {
    private static ProductsService: ProductsService
    // se aplica el patrón Singlenton
    private constructor() { }

    public static getInstnacie() {
        if (!this.ProductsService) // si no ha sido creada instnacia
            this.ProductsService = new ProductsService()

        return this.ProductsService
    }

    // Método para obtener todos los productos del servidor
    public async findProducts(name?: string, price?: number, discount?: number,
        preciodiscount?: number, averageReview?: number /* filtros de los productos */): Promise<Array<ProductDTO>> {
        let products = new Array<ProductDTO>

        // se definen los parametros query
        const params = new URLSearchParams()
        if (name) { params.append('name', name) }
        if (price) { params.append('price', price.toString()) }
        if (discount) { params.append('discount', discount.toString()) }
        if (preciodiscount) { params.append('preciodiscount', preciodiscount.toString()) }
        if (averageReview) { params.append('averageReview', averageReview.toString()) }

        const url = process.env.NEXT_PUBLIC_API_URL + '/product?' + params
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

        products = await res.json() // se obtiene la respuesta


        return products
    }

    // Método para insertar un producto
    public async createProduct(createProductDTO: CreateProductDTO) {

        const url = process.env.NEXT_PUBLIC_API_URL + '/product'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: createProductDTO.name,
                price: createProductDTO.price, // cuando se crea un producto se crea con un precio base (luego las modificaciones sobre el se guardaran en un registro)
                discount: createProductDTO.discount,
                photoURL: createProductDTO.photoURL, // representa la URL de la imagen que representa al producto
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
    }

    // Método para actualizar un producto en específico
    public async updateProduct(idProduct: string, updateProductDTO: UpdateProductDTO) {

        const url = process.env.NEXT_PUBLIC_API_URL + '/product/' + idProduct
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: updateProductDTO.name,
                price: updateProductDTO.price, // cuando se crea un producto se crea con un precio base (luego las modificaciones sobre el se guardaran en un registro)
                discount: updateProductDTO.discount,
                photoURL: updateProductDTO.photoURL, // representa la URL de la imagen que representa al producto
            })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
    }


    // Método para eliminar todos los productos específicados
    public async removeAll(listProducts: Array<string>) {

        const url = process.env.NEXT_PUBLIC_API_URL + '/product/remove-selected'
        const res: Response = await fetch(url, { // se realiza la peticion al end point
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listId: listProducts })
        })

        // Si no ocurre nigún error
        if (res.status === 400) { // ocurrió una BadRequest
            const bagRequest: BadRequestInterface = await res.json() // se obtiene el json de la respuesta
            throw new Error(bagRequest.message)
        }
    }

}
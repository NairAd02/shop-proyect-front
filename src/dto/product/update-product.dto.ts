import { CreateProductDTO } from "./create-product.dto";
import { ProductDTO } from "./product.dto";

export class UpdateProductDTO extends CreateProductDTO {
    constructor(name: string,
        price: number,
        discount: number,
        photoURL: string) {
        super(name, price, discount, photoURL)
    }
}
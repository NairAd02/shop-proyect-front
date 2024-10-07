export class CreateProductDTO {
    name: string
    price: number
    discount: number
    photoURL: string

    constructor(name: string,
        price: number,
        discount: number,
        photoURL: string) {
        this.name = name
        this.discount = discount
        this.price = price
        this.photoURL = photoURL
    }
}
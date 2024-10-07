export class ProductDTO {
    id: string
    name: string
    price: number
    discount: number // si no hay discount el valor es 0
    preciodiscount: number
    averageReview: number
    photoURL: string // representa la URL de la imagen que representa al producto

    constructor(id: string,
        name: string,
        price: number,
        discount: number,
        preciodiscount: number,
        averageReview: number,
        photoURL: string) {
        this.id = id
        this.name = name
        this.price = price
        this.discount = discount
        this.preciodiscount = preciodiscount
        this.averageReview = averageReview
        this.photoURL = photoURL
    }
}
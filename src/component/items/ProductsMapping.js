import { APP_URL_ENV } from "@env"

export const ProductsMapping = (data) => {
    if (!data) return []
    if (data && !data.products.data) return []

    return data.products.data.map((product) => {
        const images = product.attributes.images.data.map(image => APP_URL_ENV + image.attributes.url.toString())
        return ({
            id: product.id,
            image: images[0],
            name: product.attributes.product_name,
            price: product.attributes.price,
            off: product.attributes.sale_price ?? "",
            rating: 0,
            new: !!product.attributes.is_new,
            isFav: !!product.attributes.is_top,
            out_of_stock: product.attributes.stock < 0
        })
    })
}
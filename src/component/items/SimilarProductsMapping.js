import { APP_URL_ENV } from "@env"

export const SimilarProductsMapping = (data) => {
    if (!data) return []

    return data.map((v) => {
        const product = v.data.attributes;
        const images = product.images.data.map(image => APP_URL_ENV + image.attributes.url.toString())
        return ({
            id: v.data.id,
            image: images[0],
            images: images,
            name: product.product_name,
            price: product.price,
            off: product.sale_price ?? "",
            rating: data.rating ?? 5,
            new: !!product.is_new,
            isFav: !!product.is_top,
            out_of_stock: product.stock < 0,
        })
    })
}
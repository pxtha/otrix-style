import { APP_URL_ENV } from "@env"

export const ProductsMapping = (data) => {
    if (!data) return []
    if (data && !data.products.data) return []

    return data.products.data.map((product) => {
        const images = product.attributes.images.data.map(image => APP_URL_ENV + image.attributes.url.toString())
        return ({
            id: product.id,
            image: images[0],
            images: images,
            name: product.attributes.product_name,
            price: product.attributes.price,
            off: product.attributes.sale_price ?? "",
            rating: data.rating ?? 5,
            new: !!product.attributes.is_new,
            isFav: !!product.attributes.is_top,
            out_of_stock: product.attributes.stock < 0,
        })
    })
}

export const ProductMapping = (data) => {
    if (!data) return {};
    const images = data.attributes.images?.data?.map(image => APP_URL_ENV + image.attributes.url.toString())
    return ({
        id: data.id,
        image: images[0],
        images: images,
        name: data.attributes.product_name,
        price: data.attributes.price,
        off: data.attributes.sale_price ?? "",
        rating: data.rating ?? 5,
        new: !!data.attributes.is_new,
        isFav: !!data.attributes.is_top,
        out_of_stock: data.attributes.stock < 0,
        description: data.attributes.description
    })
}
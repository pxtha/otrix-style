export const wishlistMapping = (data) => {
    if (!data) return [];
    return data.map((value) => {
        const wishlistId = value.id.toString();
        const productId = value.attributes.product.data.id.toString();
        return { wishlistId, productId }
    })
}


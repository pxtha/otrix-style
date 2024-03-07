export const cartMapping = (data, productId) => {
    if (!data) return {};
    return {
        cartId: data.id,
        quantity: data.attributes.quantity,
        id: productId
    }
}


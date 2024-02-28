export const reviewMapping = (data) => {
    if (!data) return {};
    let sumRating = 0;
    const result = data.map((v) => {
        sumRating += v.attributes.rating
        return {
            rating: v.attributes.rating,
            name: v.attributes.name,
            comment: v.attributes.comment,
            createdAt: v.attributes.createdAt
        }
    })
    return {
        rating: sumRating / data.length,
        data: result
    }
}
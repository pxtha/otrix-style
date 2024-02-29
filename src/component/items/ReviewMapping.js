export const reviewMapping = (data) => {
    if (data && data.length) {
        let sumRating = 0;
        const result = data.map((v) => {
            sumRating += v.attributes.rating
            return {
                rating: v.attributes.rating,
                name: v.attributes.name,
                comment: v.attributes.comment,
                createdAt: v.attributes.createdAt
            }
        });

        const groupBy = data.reduce((acc, cur) => {
            const key = cur.attributes.rating;
            if (acc.hasOwnProperty(key)) {
                acc[key] = [...acc[key], cur.attributes]
            } else {
                acc[key] = [cur.attributes]
            }
            return acc;
        }, {})

        return {
            rating: sumRating / data.length,
            data: result,
            groupBy
        }
    }
    return {};
}
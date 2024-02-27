
import { APP_URL_ENV } from "@env"

export const categoryMapping = (data) => {
    if (!data || !data.length) return [];
    return data.map((v) => {
        const url = APP_URL_ENV + v.attributes?.images?.data?.attributes?.url.toString();
        return {
            id: v.id,
            image: url,
            name: v.attributes.name
        }
    })
}
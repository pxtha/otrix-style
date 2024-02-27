import { APP_URL_ENV } from "@env"

export const bannerMapping = (data) => {
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => {
        if (typeof value !== 'string') {
            const urls = value.data?.map(v => APP_URL_ENV + v.attributes.url.toString())
            return { [key]: urls }
        }
        return null;
    })
}


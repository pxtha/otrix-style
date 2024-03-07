import { ACCESS_TOKEN, API_URL } from "@common/config";
import * as RootNavigation from '../../AppNavigator';
import { APP_URL_ENV } from "@env"

var authHeader = new Headers();
authHeader.append("Accept", "application/json");
authHeader.append("Content-Type", "application/json");
// authHeader.append("authorization", ACCESS_TOKEN);

const getDataService = {

    getData: function (url) {

        return new Promise((resolve, reject) => {
            fetch(API_URL + url, {
                method: "GET",
                headers: authHeader
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.status == 0 && json.message == 'unauthorize') {
                        RootNavigation.navigate('UnauthorizeScreen', {});
                    }
                    else if (json.status == 0 && json.message == 'notloggedin') {
                        RootNavigation.navigate('LoginScreen', {});
                    }
                    else {
                        resolve(json)
                    }
                })
                .catch((error) => console.error(error))
        });
    },

    postData: function (url, data = null) {




        return fetch(API_URL + url, {
            method: "POST",
            headers: authHeader,
            body: data
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == 0 && responseJson.message == 'unauthorize') {
                    RootNavigation.navigate('UnauthorizeScreen', {});
                }
                else {
                    return responseJson
                }
            })
            .catch(error => {
                console.error(error);
            });
    },

    jsonpostData: async function (url, data = null, token = null, cartToken) {

        return fetch(API_URL + url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/vnd.api+json',
                //  'Commerce-Cart-Token': cartToken,
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(async responseJson => {
                return responseJson;
            })
            .catch(error => {
                console.error(error);
            });
    },

    login: async function (payload) {
        const authApi = '/api/auth/local'
        return fetch(APP_URL_ENV + authApi, {
            method: "POST",
            headers: authHeader,
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .catch(error => {
                console.error(error);
            });
    },

    register: async function (payload) {
        const authApi = '/api/auth/local/register'
        return fetch(APP_URL_ENV + authApi, {
            method: "POST",
            headers: authHeader,
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .catch(error => {
                console.error(error);
            });
    },

    addToWishList: async (userId, wishListArray, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        const requestList = wishListArray.map((item) => {
            let request = new Request(`${APP_URL_ENV}/api/wishlists?populate=*&filters[user_id][id][$eq]=${userId}&filters[product][id]=${item}`, {
                headers: headers,
                method: 'GET'
            });

            return fetch(request).then(res => res.json());
        })

        const reponseList = await Promise.all(requestList);

        const indexWishlist = reponseList.findIndex(response => response.data.length === 0);
        const payload = {
            data: {
                user_id: userId,
                product: wishListArray[indexWishlist],
            }
        }

        return fetch(`${APP_URL_ENV}/api/wishlists`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        }).then(r => r.json()).catch(error => {
            console.error(error);
        });

    },


    AddToCartList: async (userId, cartListArray) => {
        try {
            cartListArray.map(async (item) => {
                const lastProductInCarOfUser = await axiosClient.get(`/carts?populate=*&filters[user_id][id][$eq]=${userId}&filters[product][id]=${item.product}`)
                if (lastProductInCarOfUser?.data?.data?.length > 0) {
                    const params = {
                        quantity: item.amount,
                    }
                    await axiosClient.put(`/carts/${lastProductInCarOfUser?.data?.data[0]?.id}`, { data: params })
                } else {
                    const params = {
                        user_id: userId,
                        product: item.product,
                        quantity: item.amount,
                    }
                    await axiosClient.post('/carts', { data: params })
                }
            })
        } catch (e) {
            console.log(e)
        }

    },

    removeWishList: async (productId, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        return fetch(`${APP_URL_ENV}/api/wishlists/${productId}`, {
            method: "DELETE",
            headers: headers,
        }).then(r => r.json()).catch(error => {
            console.error(error);
        });
    },

    RemoveCart: async (id, userid) => {
        await axiosClient.get(`/carts?populate=*&filters[user_id][id][$eq]=${userid}&filters[product][id]=${id}`).then(
            (response) => {
                if (response?.data?.data?.length > 0) {
                    axiosClient.delete('/carts/' + response?.data?.data[0]?.id)
                }
            })
    },

    getUserWishList: (id, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        return fetch(`${APP_URL_ENV}/api/wishlists?populate[product][populate][0]=product_variants&populate[product][populate][1]=images&filters[user_id][id][$eq]=${id}`, {
            method: "GET",
            headers: headers,
        }).then(r => r.json()).catch(error => {
            console.error(error);
        });

        // const response = await axiosClient.get('/wishlists?populate[product][populate][0]=product_variants&populate[product][populate][1]=images&filters[user_id][id][$eq]=' + id)
        // const wishlist = []
        // if (response) {
        //     response?.data.map((item) => (
        //         wishlist.push(item?.attributes?.product?.data)
        //     ))
        // }
        // return wishlist
    },

    GetUserCart: async (id) => {
        const response = await axiosClient.get('/carts?populate[product][populate]=*&populate[size]=*&populate[product_variant]=*&filters[user_id][id][$eq]=' + id)
        if (response) {
            return response?.data
        }
    },

    GetUserDetail: async () => {
        const response = await axiosClient.get('/users/me')
        return (response?.data ? response?.data : null)
    },

    Checkout: async (cartListArray) => {
        const response = await axiosClient.post('/orders', {
            products: cartListArray
        })
        return (response?.data ? response?.data : null)
    }
};
export default getDataService;

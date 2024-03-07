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


    addToCartList: async (userId, product, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        const responseCheck = await fetch(`${APP_URL_ENV}/api/carts?populate=*&filters[user_id][id][$eq]=${userId}&filters[product][id]=${product.id}`, {
            headers: headers,
            method: 'GET'
        }).then(res => res.json());

        if (responseCheck) {
            if (responseCheck.data.length > 0) {
                const payload = {
                    data: {
                        quantity: product.quantity,
                    }
                }
                return fetch(`${APP_URL_ENV}/api/carts/${responseCheck.data[0]?.id}`, {
                    headers: headers,
                    method: 'PUT',
                    body: JSON.stringify(payload)
                }).then(r => r.json()).catch(error => {
                    console.error(error);
                });
            }
            else {
                const payload = {
                    data: {
                        user_id: userId,
                        product: product.id,
                        quantity: product.quantity,
                    }
                }
                return fetch(`${APP_URL_ENV}/api/carts`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify(payload)
                }).then(r => r.json()).catch(error => {
                    console.error(error);
                });
            }
        }
    },

    updateCart: (cartId, quantity, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        const payload = {
            data: {
                quantity: quantity,
            }
        }
        return fetch(`${APP_URL_ENV}/api/carts/${cartId}`, {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify(payload)
        }).then(r => r.json()).catch(error => {
            console.error(error);
        });
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

    removeCart: async (id, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        return fetch(`${APP_URL_ENV}/api/carts/${id}`, {
            method: "DELETE",
            headers: headers,
        }).then(r => r.json()).catch(error => {
            console.error(error);
        });
    },

    checkoutCart: async (listIds, token) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }

        const requestList = listIds.map((id) => {
            let request = new Request(`${APP_URL_ENV}/api/carts/${id}`, {
                method: "DELETE",
                headers: headers,
            });

            return fetch(request).then(res => res.json());
        })

        return Promise.all(requestList);
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
    },

    getUserCart: async (id) => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        return fetch(`${APP_URL_ENV}/api/carts?populate[product][populate]=*&populate[size]=*&populate[product_variant]=*&filters[user_id][id][$eq]=${id}`, {
            method: "GET",
            headers: headers,
        }).then(r => r.json()).catch(error => {
            console.error(error);
        });
    },

    getUserDetail: async () => {
        const response = await axiosClient.get('/users/me')
        return (response?.data ? response?.data : null)
    },

    checkout: async (cartListArray) => {
        const response = await axiosClient.post('/orders', {
            products: cartListArray
        })
        return (response?.data ? response?.data : null)
    }
};
export default getDataService;

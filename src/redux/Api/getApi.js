import { ACCESS_TOKEN, API_URL } from "@common/config";
import * as RootNavigation from '../../AppNavigator';

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
        const authApi = 'http://192.168.52.102:1337/api/auth/local'
        console.log(payload, "login payload::")
        return fetch(authApi, {
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
        return fetch(API_URL + authApi, {
            method: "POST",
            headers: authHeader,
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .catch(error => {
                console.error(error);
            });
    }
};
export default getDataService;

import { call, put, takeEvery } from "redux-saga/effects";
import { types } from "@actions/actionTypes";
import {
    successInt, successCart, successCheckout, authStatus, authData, successWishlist, addRemoveWishlist, authUserInfo, successGetToWishlist, addToWishList
} from "@actions";
import AsyncStorage from '@react-native-community/async-storage'
import { logfunction, _getLocalCart } from "@helpers/FunctionHelper";
import * as RootNavigation from '../../AppNavigator';
import { changeLanguage, getLanguage } from '../../locales/i18n';
import getDataService from "../Api/getApi";
import { wishlistMapping } from "@component/items/WishlistMapping";
import { cartMapping } from "@component/items/CartMapping";

export function* watchGeneralRequest() {
    yield takeEvery(types.REQUEST_INIT, requestInit);
    yield takeEvery(types.ADD_TO_CART, addToCart);
    yield takeEvery(types.GET_TO_WISHLIST, getToWishlist);
    yield takeEvery(types.UPDATE_TO_WISHLIST, updateToWishlist);
    yield takeEvery(types.REMOVE_CART, removeFromCart);
    yield takeEvery(types.INCREMENT_QUANTITY, incrementQuantity);
    yield takeEvery(types.DEREMENT_QUANTITY, decrementQuantity);
    yield takeEvery(types.PROCEED_CHECKOUT, proceedCheckout);
    yield takeEvery(types.DO_LOGIN, doLogin);
    yield takeEvery(types.DO_REGISTER, doRegister);
    yield takeEvery(types.DO_LOGOUT, doLogout);
}

function* requestInit(action) {
    try {

        // ************** If you want to login based home page then do stuff here ****************

        // if (action.payload.userAuth) {
        //     yield put(successInt('HomeScreen'));
        // }
        // else {
        //     yield put(successInt('LoginScreen'));
        // }

        // ************** Else here ****************

        //AsyncStorage.removeItem('IS_AUTH');

        //get local login data
        let getAuth = yield call(AsyncStorage.getItem, "IS_AUTH")
        logfunction("IS LOGGED ", getAuth);

        //get language 
        let getLocalLanguage = yield call(AsyncStorage.getItem, "Language")

        //set language
        if (getLocalLanguage != null) {
            yield put(changeLanguage(getLocalLanguage));

        }
        else {
            yield put(changeLanguage('en'));
        }

        //set theme
        let getTheme = yield call(AsyncStorage.getItem, "THEME")
        let currentTheme = 'light';
        if (getTheme) {
            if (getTheme == 'dark') {
                currentTheme = 'dark';
            }
        }

        yield put(successTheme(currentTheme));

        //cart count set
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);
        if (getLocalCart) {
            yield put(successCart(getLocalCart));
        }

        //Wishlist latest

        if (getAuth == 1) {
            yield put(authStatus(true));
            let getData = yield call(AsyncStorage.getItem, "CUSTOMER_DATA")
            let userInfo = yield call(AsyncStorage.getItem, "USER_INFO")

            yield put(authData(JSON.parse(getData)));
            yield put(authUserInfo(JSON.parse(userInfo)));
            yield put(successGetToWishlist())
        }
        else {
            yield put(authStatus(false));
        }


        yield put(successInt('MainScreen'));


    } catch (e) {
        logfunction(e)
    }
}

export function successTheme(theme) {
    return {
        type: types.SET_THEME,
        payload: {
            theme
        }
    };
}
function* addToCart(action) {
    try {
        const { payload } = action;
        logfunction("Payload ==", payload)

        let getAuth = yield call(AsyncStorage.getItem, "USER_INFO")
        const token = JSON.parse(getAuth).jwt
        const userId = JSON.parse(getAuth).user.id;
        const responseSuccess = yield call(getDataService.addToCartList, userId, payload, token)
        const cartConvert = cartMapping(responseSuccess?.data, payload.id)

        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);

        // logfunction("LOCAL CART  ", JSON.parse(getLocalCart));
        if (getLocalCart != null) {
            let storeProducts = getLocalCart.cartProducts;
            storeProducts.push(cartConvert);
            let totalQty = parseInt(getLocalCart.totalCount);
            logfunction("TOTAL ", totalQty)
            let storeArr = { cartProducts: storeProducts, totalCount: totalQty + parseInt(payload.quantity) };
            logfunction("FINAL ARRR ", storeArr)
            AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
            yield put(successCart(storeArr))
        }
        else {
            let storeArr = { cartProducts: [cartConvert], totalCount: payload.quantity };
            logfunction("storeArr ", storeArr);
            AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
            yield put(successCart(storeArr));
        }

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* removeFromCart(action) {
    try {
        const { payload } = action;
        let getAuth = yield call(AsyncStorage.getItem, "USER_INFO")
        const token = JSON.parse(getAuth).jwt

        let newArr = [];
        let cartId = -1;
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);
        let finalCount = getLocalCart.totalCount;
        logfunction("finalCount", finalCount)
        logfunction("getLocalCart", getLocalCart)

        getLocalCart.cartProducts.forEach(function (item, index) {
            if (item.id != payload.id) {
                newArr.push(item);
            }
            else {
                finalCount -= item.quantity;
                cartId = item.cartId;
                logfunction("ITEM TO DEELTE", item)
            }
        });

        logfunction("QUANTITY ", finalCount)

        logfunction("NEW ARRR", newArr)
        let storeArr = { cartProducts: newArr, totalCount: finalCount };
        logfunction("ARR TO STORE ", storeArr)
        yield call(getDataService.removeCart, cartId, token)
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* incrementQuantity(action) {
    try {
        const { payload } = action;
        let getAuth = yield call(AsyncStorage.getItem, "USER_INFO")
        const token = JSON.parse(getAuth).jwt

        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);
        let finalCount = getLocalCart.totalCount;
        logfunction("finalCount", finalCount)
        logfunction("getLocalCart", getLocalCart)

        let findProduct = getLocalCart.cartProducts.find(item => item.id === payload.id);
        let findProductIndex = getLocalCart.cartProducts.findIndex((item) => item.id === payload.id);

        //update quantity
        findProduct.quantity = parseInt(findProduct.quantity) + 1;

        getLocalCart.cartProducts.splice(findProductIndex, 1, findProduct);

        let storeArr = { cartProducts: getLocalCart.cartProducts, totalCount: parseInt(finalCount) + 1 };
        yield call(getDataService.updateCart, findProduct.cartId, findProduct.quantity, token)
        logfunction("ARR TO STORE ", storeArr)
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* decrementQuantity(action) {
    try {
        const { payload } = action;
        let getAuth = yield call(AsyncStorage.getItem, "USER_INFO")
        const token = JSON.parse(getAuth).jwt

        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);
        let finalCount = getLocalCart.totalCount;
        logfunction("finalCount", finalCount)
        logfunction("getLocalCart", getLocalCart)

        let findProduct = getLocalCart.cartProducts.find(item => item.id === payload.id);
        let findProductIndex = getLocalCart.cartProducts.findIndex((item) => item.id === payload.id);

        //update quantity
        findProduct.quantity = parseInt(findProduct.quantity) - 1;

        getLocalCart.cartProducts.splice(findProductIndex, 1, findProduct);

        let storeArr = { cartProducts: getLocalCart.cartProducts, totalCount: finalCount - 1 };

        logfunction("ARR TO STORE ", storeArr)
        yield call(getDataService.updateCart, findProduct.cartId, findProduct.quantity, token)
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}


function* proceedCheckout(action) {
    try {
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);

        let getAuth = yield call(AsyncStorage.getItem, "USER_INFO")
        const token = JSON.parse(getAuth).jwt

        const cartListIds = getLocalCart.cartProducts.map(v => v.cartId)
        yield call(getDataService.checkoutCart, cartListIds, token)
        AsyncStorage.removeItem('CART_DATA');
        yield put(successCheckout());

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* updateToWishlist(action) {
    try {
        let getAuth = yield call(AsyncStorage.getItem, "USER_INFO")
        const token = JSON.parse(getAuth).jwt
        const userId = JSON.parse(getAuth).user.id;

        let wishlistId = yield call(AsyncStorage.getItem, "WISHLIST_ID")
        const wishlistParser = JSON.parse(wishlistId) ?? [];
        let result = [...wishlistParser];

        const { productId, data } = action.payload;

        let wishData = { totalCount: data.length, wishlistData: data }

        if (data.includes(productId)) {
            const responseSuccess = yield call(getDataService.addToWishList, userId, data, token)
            //update wishlist
            result = [...wishlistParser, { wishlistId: responseSuccess.data.id, productId }]

        } else {
            const found = result.find((v) => v.productId == productId)
            yield call(getDataService.removeWishList, found.wishlistId, token)
            result = wishlistParser.filter(v => v.productId != productId)
        }

        AsyncStorage.setItem("WISHLIST_ID", JSON.stringify(result));
        yield put(successWishlist(wishData));
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* getToWishlist() {
    try {
        let getAuth = yield call(AsyncStorage.getItem, "USER_INFO")
        const token = JSON.parse(getAuth).jwt
        const userId = JSON.parse(getAuth).user.id;
        const getWishlist = yield call(getDataService.getUserWishList, userId, token)

        if (getWishlist && getWishlist.data.length) {
            const wishlistDataMapping = wishlistMapping(getWishlist.data);
            AsyncStorage.setItem("WISHLIST_ID", JSON.stringify(wishlistDataMapping));

            const productListIds = wishlistDataMapping.map(v => v.productId);
            let wishData = { totalCount: productListIds.length, wishlistData: productListIds }

            if (wishData) {
                yield put(successWishlist(wishData));
            }
        }
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* doLogin(action) {
    try {
        const { email, password } = action.payload.data;

        const responseLogin = yield call(getDataService.login, {
            identifier: email,
            password: password
        })

        if (responseLogin && responseLogin.jwt) {
            AsyncStorage.setItem('IS_AUTH', '1');
            AsyncStorage.setItem('USER_INFO', JSON.stringify(responseLogin));
            yield put(authUserInfo(responseLogin))
            yield put(authStatus(true));
        }
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* doRegister(action) {
    try {
        console.log("doRegister::", action.payload)
        // const { email, password } = action.payload.data;
        // const responseLogin = yield call(getDataService.register, {
        //     identifier: email,
        //     password: password
        // })

        // if (responseLogin && responseLogin.jwt) {
        //     AsyncStorage.setItem('IS_AUTH', '1');
        //     AsyncStorage.setItem('TOKEN', responseLogin.jwt);
        //     yield put(authUserInfo(responseLogin.user))
        //     yield put(authStatus(true));
        // }
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* doLogout(action) {
    try {
        const { payload } = action;
        AsyncStorage.removeItem('IS_AUTH');
        AsyncStorage.removeItem('USER_INFO');
        yield put(authStatus(false));
        yield put(authUserInfo({
            jwt: "",
            user: {}
        }))
    } catch (e) {
        logfunction('ERROR =', e)
    }
}
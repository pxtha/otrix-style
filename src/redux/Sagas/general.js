import { call, put, takeEvery } from "redux-saga/effects";
import { types } from "@actions/actionTypes";
import {
    successInt, successCart, successCheckout, authStatus, authData, successWishlist, addRemoveWishlist, authUserInfo
} from "@actions";
import AsyncStorage from '@react-native-community/async-storage'
import { logfunction, _getLocalCart } from "@helpers/FunctionHelper";
import * as RootNavigation from '../../AppNavigator';
import { changeLanguage, getLanguage } from '../../locales/i18n';
import getDataService from "../Api/getApi";

export function* watchGeneralRequest() {
    yield takeEvery(types.REQUEST_INIT, requestInit);
    yield takeEvery(types.ADD_TO_CART, addToCart);
    yield takeEvery(types.ADD_TO_WISHLIST, addToWishlist);
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

        //Wishlist count set
        let getLocalWishlist = yield call(AsyncStorage.getItem, "GET_LOCAL_WISHLIST");
        logfunction("LOCAL Wishlist  ", JSON.parse(getLocalWishlist));
        getLocalWishlist = JSON.parse(getLocalWishlist);
        if (getLocalWishlist) {
            yield put(successWishlist(getLocalWishlist));
        }

        if (getAuth == 1) {
            yield put(authStatus(true));
            let getData = yield call(AsyncStorage.getItem, "CUSTOMER_DATA")
            let userInfo = yield call(AsyncStorage.getItem, "USER_INFO")

            yield put(authData(JSON.parse(getData)));
            yield put(authUserInfo(JSON.parse(userInfo)));

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
        //  
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        logfunction("LOCAL CART  ", JSON.parse(getLocalCart));
        getLocalCart = JSON.parse(getLocalCart);
        if (getLocalCart != null) {
            // let findProduct = getLocalCart.cartProducts.filter(item => item.product_id.indexOf(payload.id) > -1);
            let findProductIndex = getLocalCart.cartProducts.findIndex((item) => item.id === payload.id);
            let storeProducts = getLocalCart.cartProducts;
            if (findProductIndex > -1) {
                let quantity = parseInt(getLocalCart.cartProducts[findProductIndex].quantity);
                logfunction("QTY", quantity)
                getLocalCart.cartProducts.splice(findProductIndex, 1);
                storeProducts.push({
                    id: payload.id, quantity: quantity + parseInt(payload.quantity)
                });
            }
            else {
                storeProducts.push({
                    id: payload.id, quantity: parseInt(payload.quantity)
                });
            }
            let totalQty = parseInt(getLocalCart.totalCount);
            logfunction("TOTAL ", totalQty)
            let storeArr = { cartProducts: storeProducts, totalCount: totalQty + parseInt(payload.quantity) };
            logfunction("FINAL ARRR ", storeArr)
            AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
            yield put(successCart(storeArr))
        }
        else {
            let storeArr = { cartProducts: [{ id: payload.id, quantity: payload.quantity }], totalCount: payload.quantity };
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
        let newArr = [];
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
                logfunction("ITEM TO DEELTE", item)
            }
        });

        logfunction("QUANTITY ", finalCount)

        logfunction("NEW ARRR", newArr)
        let storeArr = { cartProducts: newArr, totalCount: finalCount };
        logfunction("ARR TO STORE ", storeArr)
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* incrementQuantity(action) {
    try {
        const { payload } = action;
        let newArr = [];
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
        let newArr = [];
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
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}


function* proceedCheckout(action) {
    try {
        AsyncStorage.removeItem('CART_DATA');
        yield put(successCheckout());

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* addToWishlist(action) {
    try {
        let wishData = { totalCount: action.payload.data.length, wishlistData: action.payload.data }
        yield put(successWishlist(wishData));
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
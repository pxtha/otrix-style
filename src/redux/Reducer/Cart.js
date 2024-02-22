import { types } from "../Action/actionTypes";
import { logfunction } from "../../helpers/FunctionHelper";

const initialState = {
    cartCount: 0,
    cartData: []
}
export default (state = initialState, action) => {
    const { payload } = action;
    logfunction("PAYLOAD IN REDUCER ", payload)
    switch (action.type) {

        case types.SUCCESS_CART:
            return {
                ...state,
                cartCount: payload.cartData.totalCount,
                cartData: payload.cartData.cartProducts
            }
        case types.SUCCESS_CHECKOUT:
            return {
                ...state,
                cartCount: 0,
                cartData: []
            }
        default:
            return state;
    }
}

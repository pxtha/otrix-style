import { types } from "../Action/actionTypes";
import { logfunction } from "../../helpers/FunctionHelper";

const initialState = {
    checkoutData: []
}
export default (state = initialState, action) => {
    const { payload } = action;
    logfunction("PAYLOAD IN REDUCER ", payload)
    switch (action.type) {

        case types.CHECKOUT_PROCESS:
            return {
                ...state,
                checkoutData: payload.checkoutData
            }
        default:
            return state;
    }
}

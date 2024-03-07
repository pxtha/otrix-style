import { types } from "../Action/actionTypes";
import { logfunction } from "../../helpers/FunctionHelper";

const initialState = {
    authStatus: false,
    userInfo: {},
    token: ""
}
export default (state = initialState, action) => {
    const { payload } = action;
    logfunction("PAYLOAD IN REDUCER AUTH", payload)
    switch (action.type) {

        case types.AUTH_STATUS:
            return {
                ...state,
                authStatus: payload.status,
            }
        case types.AUTH_USER_INFO:
            return {
                ...state,
                userInfo: { ...payload.userInfo },
                token: payload.token
            }
        default:
            return state;
    }
}

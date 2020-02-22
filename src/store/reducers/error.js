import {updateObject} from '../../common/utilities';
import {createAction} from '../common';
import * as types from '../types';

const initialState = {
    error: false,
    message: null,
    detail: null
};

const set = (state, action) => {
    return updateObject(state, {error: true, message: action.message, detail: action.detail});
};

const clear = (state) => {
    return updateObject(state, {error: false, message: null, detail: null});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.error.SETERROR: return set(state, action);
        case types.error.CLEARERROR: return clear(state);
        default: return state;
    };
};

export default reducer;

export const setError = (message, detail) => {
    return createAction(types.error.SETERROR, {message: message, detail: detail});
};

export const clearError = () => {
    return createAction(types.error.CLEARERROR);
};
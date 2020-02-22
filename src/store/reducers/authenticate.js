import methodtype from '../../common/methodtypes';
import {updateObject, copyObject} from '../../common/utilities';
import {createAction, callAPI} from '../common';
import * as types from '../types';
import {getSessionStatus} from './status';
import axios from '../../axios/axios';

const initialState = {
    userId: null,
    password: null,
    sessionId: null,
    valid: false,
    validate: true,
    selectedId: 1
};

const set = (state, action) => {
    return updateObject(state, {[action.id]: action.value});
};

const setValid = (state, action) => {
    return updateObject(state, {valid: action.valid, validate: false});
};

const start = (state) => {
    return updateObject(state, {sessionId: null});
};

const success = (state, action) => {
    return updateObject(state, {userId: null, password: null, sessionId: action.sessionId});
};

const fail = (state) => {
    return updateObject(state, {userId: null, password: null, sessionId: null, validate: true});
};

const reset = () => {
    return copyObject(initialState);
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.authenticate.SET: return set(state, action);
        case types.authenticate.SETVALID: return setValid(state, action);
        case types.authenticate.START: return start(state, action);
        case types.authenticate.SUCCESS: return success(state, action);
        case types.authenticate.RESET: return reset();
        case types.authenticate.FAIL: return fail(state);
        default: return state;
    };
};

export default reducer;

export const setAuthentication = (id, value) => {
    return createAction(types.authenticate.SET, {id: id, value: value});
};

export const setLoginValid = (valid) => {
    return createAction(types.authenticate.SETVALID, {valid: valid});
};

export const login = (userId, password) => {
    return dispatch => {
        const url = "/rcp/admin/sync/login";
        const success = response => {
            axios.defaults.headers.common['sessionId'] = response.data.sessionId;
            axios.defaults.headers.common['userId'] = userId;
            dispatch(getSessionStatus());
        };
        const options = {
            action: response => {return {userId: userId, sessionId: response.data.sessionId}},
            successfns: {success},
            headers: {"userId": userId, "password": password, "content-type": "application/json"}
        };
        callAPI(dispatch, url, methodtype.POST, null, types.authenticate, options);
    };
};

export const logoff = () => {
    return dispatch => {
        const url = "/rcp/admin/sync/logoff";
        const reset = () => {
            dispatch(createAction(types.authenticate.RESET));
            dispatch(createAction(types.search.RESET));
            dispatch(createAction(types.recipe.RESET));
            dispatch(createAction(types.method.RESET));
            dispatch(createAction(types.ingredient.RESET));
            dispatch(createAction(types.status.RESET));
        };
        const options = {
            start: () => {},
            startfns: {reset},
            success: () => {},
            failure: () => {}
        };
        callAPI(dispatch, url, methodtype.POST, null, types.authenticate, options);
    };
};
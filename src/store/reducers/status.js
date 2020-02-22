import methodtype from '../../common/methodtypes';
import {updateObject, copyObject} from '../../common/utilities';
import {createAction, callAPI} from '../common';
import * as types from '../types';

const initialState = {
    time: null
};

const setTime = (state) => {
    return updateObject(state, {time: new Date()});
};

const start = (state) => {
    return updateObject(state, {running: true});
};

const success = (state, action) => {
    return updateObject(state, {running: false, data: action.data});
};

const fail = (state) => {
    return updateObject(state, {running: false});
};

const clear = (state) => {
    const newState = {...state};
    delete newState.data;
    return newState;
};

const reset = () => {
    return copyObject(initialState);
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.status.TIME: return setTime(state);
        case types.status.CLEAR: return clear(state);
        case types.status.START: return start(state);
        case types.status.SUCCESS: return success(state, action);
        case types.status.FAIL: return fail(state);
        case types.status.RESET: return reset();
        default: return state;
    };
};

export default reducer;

export const setCurrentTime = () => {
    return createAction(types.status.TIME);
};

export const getSessionStatus = () => {
    return dispatch => {
        const url = "/rcp/admin/sync/session/status";
        const options = {
            action: response => {return {data: response.data}},
            start: () => {},
            failure: () => {}
        };
        callAPI(dispatch, url, methodtype.GET, null, types.status, options);
    };
};

export const resetSession = () => {
    return dispatch => {
        const url = "/rcp/admin/sync/session/reset";
        const options = {
            action: response => {return {data: response.data}},
            start: () => {},
            failure: () => {}
        };
        callAPI(dispatch, url, methodtype.GET, null, types.status, options);
    };
};

export const clearStatus = () => {
    return createAction(types.status.CLEAR);
};
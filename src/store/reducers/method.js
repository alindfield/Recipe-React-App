import methodtype from '../../common/methodtypes';
import datatypes from '../../common/datatypes';
import {updateObject, copyObject} from '../../common/utilities';
import {createAction, callAPI} from '../common';
import * as types from '../types';

const initialState = {
    method: null,
    oldmethod: null,
    methods: null,
    datatype: null,
    retrieve: false
}

const start = (state) => {
    return updateObject(state, {retrieve: false});
};

const success = (state, action) => {
    if (action.methods !== undefined && action.methods !== null) {
        return updateObject(state, {methods : action.methods});
    }
    if (action.method !== undefined && action.method !== null) {
        return updateObject(state, {method: action.method, oldmethod: copyObject(action.method), datatype: action.datatype});
    }
    if (action.datatype !== undefined && action.datatype !== null) {
        return updateObject(state, {datatype: action.datatype});
    }
    return state;
};

const fail = (state) => {
    return state;
};

const reset = () => {
    return copyObject(initialState);
};

const clear = (state) => {
    return updateObject(state, {method: null, oldmethod: null, datatype: null}); 
};

const set = (state, action) => {
    const {destination, source} = action.result;
    const methods = copyObject(state.methods);
    const method = methods[source.index];    
    methods.splice(source.index, 1);
    methods.splice(destination.index, 0, method);
    return updateObject(state, {methods: methods});
};

const cancel = (state) => {
    return updateObject(state, {datatype: null, method: null, oldmethod: null});
};

const change = (state, action) => {
    const newRecord = {...state.method, [action.key]: action.value};
    return updateObject(state, {method: newRecord});
};

const retrieve = (state) => {
    return updateObject(state, {datatype: null, retrieve: true});
};

const setValid = (state, action) => {
    return updateObject(state, {valid: action.valid});
};

const setMode = (state, action) => {
    return updateObject(state, {datatype: action.datatype});
};

const create = (state) => {
    return updateObject(state, {method: {}, datatype: datatypes.INSERT});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.method.START: return start(state);
        case types.method.SUCCESS: return success(state, action);
        case types.method.FAIL: return fail(state);
        case types.method.RESET: return reset();
        case types.method.CLEAR: return clear(state);
        case types.method.SET: return set(state, action);
        case types.method.EDITCANCEL: return cancel(state);
        case types.method.CHANGE: return change(state, action);
        case types.method.RETRIEVE: return retrieve(state);
        case types.method.VALID: return setValid(state, action);
        case types.method.SETMODE: return setMode(state, action);
        case types.method.CREATE: return create(state);
        default: return state;
    };
};

export default reducer;

export const clearMethods = () => {
    return createAction(types.method.RESET);
};

export const clearMethod = () => {
    return createAction(types.method.CLEAR);
};

export const getMethod = (recipeId, methodId, datatype) => {
    return dispatch => {
        const url = "/rcp/app/sync/recipe/" + recipeId + "/method/" + methodId;
        callAPI(dispatch, url, methodtype.GET, null, types.method, {action: response => {return {method: response.data, datatype: datatype}}});
    };
};

export const getMethods = (recipeId) => {
    return dispatch => {
        const url = "/rcp/app/sync/recipe/" + recipeId + "/method";
        callAPI(dispatch, url, methodtype.GET, null, types.method, {action: response => {return {methods: response.data}}});
    };
};

export const orderMethods = (recipeId, methods) => {
    return dispatch => {
        const url = "/rcp/app/sync/recipe/" + recipeId + "/method/order";
        callAPI(dispatch, url, methodtype.PUT, methods, types.method, {action: response => {return {methods: response.data}}});
    };
};

export const setMethods = (methods) => {
    return createAction(types.method.SUCCESS, {methods: methods});
};

export const cancelEditMethod = () => {
    return createAction(types.method.EDITCANCEL);
};

export const changeMethod = (key, value) => {
    return createAction(types.method.CHANGE, {key: key, value: value});
};

export const saveMethod = (recipeId, method, mode) => {
    return dispatch => {
        let [url, requestmethod, payload] = [null, null, null];
        switch (mode) {
            case datatypes.INSERT:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipeId + "/method", methodtype.POST, method];
                break;
            case datatypes.UPDATE:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipeId + "/method/" + method.id, methodtype.PUT, method];
                break;
            case datatypes.DELETE:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipeId + "/method/" + method.id, methodtype.DELETE, null];
                break;
            default:
                return;
        };
        callAPI(dispatch, url, requestmethod, payload, types.method, {action: () => {dispatch(clearMethod()); dispatch(createAction(types.method.RETRIEVE));}});
    };
};

export const setMethodValid = (valid) => {
    return createAction(types.method.VALID, {valid: valid});
};

export const createMethod = () => {
    return createAction(types.method.CREATE);
};
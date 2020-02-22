import methodtype from '../../common/methodtypes';
import datatypes from '../../common/datatypes';
import {updateObject, copyObject} from '../../common/utilities';
import {createAction, callAPI} from '../common';
import * as types from '../types';
import {getMedia} from './media';

const initialState = {
    loading: false,   // loading - controls spinner
    datatype: null,
    recipe: null,     // current record
    oldrecipe: null,  // original record
    valid: true,
    selectedId: 1
};

const start = (state) => {
    return updateObject(state, {loading: true});
};

const success = (state, action) => {
    if (action.exit !== undefined && action.exit) {
        return updateObject(state, {exit: action.exit, loading: false, recipe: null, oldrecipe: null, datatype: null});
    } else {
        if (action.recipe !== undefined && action.recipe !== null) {
            return updateObject(state, {loading: false, recipe: action.recipe, oldrecipe: copyObject(action.recipe)});
        }
    }
    return state;
};

const fail = (state) => {
    return updateObject(state, {loading: false});
};

const setTab = (state, action) => {
    return updateObject(state, {selectedId: action.selectedId});
};

const reset = () => {
    return copyObject(initialState);
};

const edit = (state, action) => {
    return updateObject(state, {datatype: (action.type === types.recipe.EDIT ? datatypes.UPDATE : datatypes.DELETE)});
};

const editCancel = (state) => {
    return updateObject(state, {datatype: null, creating: false, error: null, recipe: (state.datatype === datatypes.INSERT ? null : copyObject(state.oldrecipe))});
};

const change = (state, action) => {
    const newRecipe = {...state.recipe, [action.key]: action.value};
    return updateObject(state, {recipe: newRecipe, error: null});
};

const clear = (state) => {
    return updateObject(state, {recipe: null, oldrecipe: null, selectedId: 1});
};

const create = (state) => {
    return updateObject(state, {datatype: datatypes.INSERT, recipe: null, oldrecipe: null});
};

const createCancel = (state) => {
    return updateObject(state, {creating: false, recipe: null, oldrecipe: null});
};

const setValid = (state, action) => {
    return updateObject(state, {valid: action.valid});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.recipe.SETTAB: return setTab(state, action);
        case types.recipe.START: return start(state);
        case types.recipe.SUCCESS: return success(state, action);
        case types.recipe.FAIL: return fail(state);
        case types.recipe.EDIT: return edit(state, action);
        case types.recipe.EDITCANCEL: return editCancel(state);
        case types.recipe.DELETE: return edit(state, action);
        case types.recipe.CHANGE: return change(state, action);
        case types.recipe.CLEAR: return clear(state);
        case types.recipe.CREATE: return create(state);
        case types.recipe.CREATECANCEL: return createCancel(state);
        case types.recipe.RESET: return reset();
        case types.recipe.SETVALID: return setValid(state, action);
        default: return state;
    };
};

export default reducer;

export const getRecipe = (id) => {
    return dispatch => {
        const url = "/rcp/app/sync/recipe/" + id;
        const success = response => {
            if (response.data.imageId) {
                dispatch(getMedia(response.data.imageId));
            };
        };
        const options = {action: response => {return {recipe: response.data}}, successfns: {success}};
        callAPI(dispatch, url, methodtype.GET, null, types.recipe, options);
    };
};

export const editRecipe = () => {
    return createAction(types.recipe.EDIT);
};

export const cancelEditRecipe = () => {
    return createAction(types.recipe.EDITCANCEL);
};

export const deleteRecipe = () => {
    return createAction(types.recipe.DELETE);
};

export const changeRecipe = (key, value) => {
    return createAction(types.recipe.CHANGE, {key: key, value: value});
};

export const clearRecipe = () => {
    return createAction(types.recipe.CLEAR);
};

const setResearch = () => {
    return createAction(types.search.SETRESEARCH);
};

export const saveRecipe = (recipe, exit, mode) => {
    return dispatch => {
        let [url, requestmethod, payload] = [null, null, null];
        switch (mode) {
            case datatypes.INSERT:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe" , methodtype.POST, recipe];
                break;
            case datatypes.UPDATE:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipe.id, methodtype.PUT, recipe];
                break;
            case datatypes.DELETE:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipe.id, methodtype.DELETE, null];
                break;
            default:
                return;
        };
        const success = () => dispatch(setResearch());  
        const successfns = {success};
        const options = {
            action: response => {return {recipe: response.data, exit: exit}},
            successfns: successfns
        };
        callAPI(dispatch, url, requestmethod, payload, types.recipe, options);
    };
};

export const createRecipe = () => {
    return createAction(types.recipe.CREATE);
};

export const setEditRecipeValid = (valid) => {
    return createAction(types.recipe.SETVALID, {valid: valid});
};

export const setRecipeTab = (selectedId) => {
    return createAction(types.recipe.SETTAB, {selectedId: selectedId});
};
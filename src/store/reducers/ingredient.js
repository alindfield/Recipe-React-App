import methodtype from '../../common/methodtypes';
import datatypes from '../../common/datatypes';
import {updateObject, copyObject} from '../../common/utilities';
import {createAction, callAPI} from '../common';
import * as types from '../types';

const initialState = {
    ingredient: null,
    oldingredient: null,
    ingredients: null,
    datatype: null,
    retrieve: false
};

const start = (state) => {
    return updateObject(state, {retrieve: false});
};

const success = (state, action) => {
    if (action.ingredients !== undefined && action.ingredients !== null) {
        return updateObject(state, {ingredients : action.ingredients});
    }
    if (action.ingredient !== undefined && action.ingredient !== null) {
        return updateObject(state, {ingredient: action.ingredient, oldingredient: copyObject(action.ingredient), datatype: action.datatype});
    }
    if (action.datatype !== undefined && action.datatype !== null) {
        return updateObject(state, {datatype: action.datatype});
    }
    return state;
};

const fail = (state) => {
    return state;
};

const reset = (state) => {
    return updateObject(state, copyObject(initialState)); 
};

const clear = (state) => {
    return updateObject(state, {ingredient: null, oldingredient: null, datatype: null}); 
};

const set = (state, action) => {
    const {destination, source} = action.result;
    const ingredients = copyObject(state.ingredients);
    const ingredient = ingredients[source.index];    
    ingredients.splice(source.index, 1);
    ingredients.splice(destination.index, 0, ingredient);
    return updateObject(state, {ingredients: ingredients});
};

const cancel = (state) => {
    return updateObject(state, {datatype: null, ingredient: null, oldingredient: null});
};

const change = (state, action) => {
    const newRecord = {...state.ingredient, [action.key]: action.value};
    return updateObject(state, {ingredient: newRecord});
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
    return updateObject(state, {ingredient: {}, datatype: datatypes.INSERT});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ingredient.START: return start(state);
        case types.ingredient.SUCCESS: return success(state, action);
        case types.ingredient.FAIL: return fail(state);
        case types.ingredient.RESET: return reset(state);
        case types.ingredient.CLEAR: return clear(state);
        case types.ingredient.SET: return set(state, action);
        case types.ingredient.EDITCANCEL: return cancel(state);
        case types.ingredient.CHANGE: return change(state, action);
        case types.ingredient.RETRIEVE: return retrieve(state);
        case types.ingredient.VALID: return setValid(state, action);
        case types.ingredient.SETMODE: return setMode(state, action);
        case types.ingredient.CREATE: return create(state);        
        default: return state;
    };
};

export default reducer;

export const setIngredientValid = (valid) => {
    return createAction(types.ingredient.VALID, {valid: valid});
};

export const createIngredient = () => {
    return createAction(types.ingredient.CREATE);
};

export const changeIngredient = (key, value) => {
    return createAction(types.ingredient.CHANGE, {key: key, value: value});
};

export const cancelEditIngredient = () => {
    return createAction(types.ingredient.EDITCANCEL);
};

export const setIngredients = (ingredients) => {
    return createAction(types.ingredient.SUCCESS, {ingredients: ingredients});
};

export const clearIngredient = () => {
    return createAction(types.ingredient.CLEAR);
};

export const clearIngredients = () => {
    return createAction(types.ingredient.RESET);
};

export const orderIngredients = (recipeId, ingredients) => {
    return dispatch => {
        const url = "/rcp/app/sync/recipe/" + recipeId + "/ingredient/order";
        callAPI(dispatch, url, methodtype.PUT, ingredients, types.ingredient, {action: response => {return {ingredients: response.data}}});
    };
};

export const getIngredient = (recipeId, ingredientId, datatype) => {
    return dispatch => {
        const url = "/rcp/app/sync/recipe/" + recipeId + "/ingredient/" + ingredientId;
        callAPI(dispatch, url, methodtype.GET, null, types.ingredient, {action: response => {return {ingredient: response.data, datatype: datatype}}});
    };
};

export const getIngredients = (recipeId) => {
    return dispatch => {
        const url = "/rcp/app/sync/recipe/" + recipeId + "/ingredient";
        const f = () => {console.log(dispatch);dispatch(createAction(types.ingredient.FAIL))};
        const functions = {f};
        callAPI(dispatch, url, methodtype.GET, null, types.ingredient, {action: response => {return {ingredients: response.data}}, startfns: functions});
    };    
};

export const saveIngredient = (recipeId, ingredient, mode) => {
    return dispatch => {
        let [url, requestmethod, payload] = [null, null, null];
        switch (mode) {
            case datatypes.INSERT:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipeId + "/ingredient", methodtype.POST, ingredient];
                break;
            case datatypes.UPDATE:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipeId + "/ingredient/" + ingredient.id, methodtype.PUT, ingredient];
                break;
            case datatypes.DELETE:
                [url, requestmethod, payload] = ["/rcp/app/sync/recipe/" + recipeId + "/ingredient/" + ingredient.id, methodtype.DELETE, null];
                break;
            default:
                return;
        };
        callAPI(dispatch, url, requestmethod, payload, types.ingredient, {action: () => {dispatch(clearIngredient()); dispatch(createAction(types.ingredient.RETRIEVE));}});
    };
};
import methodtype from '../../common/methodtypes';
import {updateObject, copyObject} from '../../common/utilities';
import {createAction, callAPI} from '../common';
import * as types from '../types';

const initialState = {
    searching: false,
    title: '',
    description: '',
    recipes: null,
    research: false
};

const set = (state, action) => {
    const title = action.title !== null ? action.title : state.title;
    const description = action.description !== null ? action.description : state.description;
    return updateObject(state, {title: title, description: description});
};

const clear = (state) => {
    return updateObject(state, {title: '', description: '', recipes: null, research: false});
};

const start = (state) => {
    return updateObject(state, {searching: true, recipes: null, research: false});
};

const success = (state, action) => {
    return updateObject(state, {searching: false, recipes: action.recipes});
};

const fail = (state) => {
    return updateObject(state, {searching: false});
};

const setResearch = (state) => {
    return updateObject(state, {research: true});
};

const reset = () => {
    return copyObject(initialState);
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.search.SETCRITERIA: return set(state, action);
        case types.search.CLEAR: return clear(state);
        case types.search.START: return start(state);
        case types.search.SUCCESS: return success(state, action);      
        case types.search.FAIL: return fail(state);
        case types.search.SETRESEARCH: return setResearch(state);
        case types.search.RESET: return reset();
        default: return state;
    };
};

export default reducer;

export const setCriteria = (title, description) => {
    return createAction(types.search.SETCRITERIA, {title: title, description: description});
};

export const clearSearch = () => {
    return dispatch => {
        dispatch(createAction(types.search.CLEAR));
        dispatch(createAction(types.media.CLEAR));
    }
};

export const clearError = () => {
    return createAction(types.search.CLEAR);
};

export const search = (title, description) => {
    return dispatch => {
        const data = {title: title, description: description};
        const url = "/rcp/app/sync/recipe/find";
        const fn = () => {dispatch(createAction(types.media.CLEAR))};
        const options = {
            action: response => {return {recipes: response.data}},
            successfns: {fn},
            failurefns: {fn}
        };
        callAPI(dispatch, url, methodtype.POST, data, types.search, options);
    };

};

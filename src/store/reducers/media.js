import {updateObject, copyObject} from '../../common/utilities';
import {createAction, callAPI} from '../common';
import methodtype from '../../common/methodtypes';
import * as types from '../types';

const initialState = {
    media: null,
    oldmedia: null,
    medias: {}
};

const fail = (state) => {
    return updateObject(state, {media: null});
};

const start = (state) => {
    return updateObject(state, {media: null});
};

const success = (state, action) => {
    if (action.media) {
        return updateObject(state, {media: action.media, oldmedia: action.reset ? action.media : state.oldmedia});
    } else if (action.thumbnail) {
        const medias = {...state.medias, [action.recipeId]: action.thumbnail}
        return updateObject(state, {medias: medias});
    } else {
        return state;
    };
    
};

const clear = (state) => {
    return updateObject(state, {media: null, medias: {}});
};

const cancelEdit = (state, action) => {
    return updateObject(state, {media: (action.creating ? null : state.oldmedia)});
};

const reset = (state) => {
    return updateObject(state, copyObject(initialState)); 
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.media.FAIL: return fail(state);
        case types.media.START: return start(state);
        case types.media.SUCCESS: return success(state, action);
        case types.media.CLEAR: return clear(state);
        case types.media.EDITCANCEL: return cancelEdit(state, action);
        case types.media.RESET: return reset(state);
        default: return state;
    };
};

export default reducer;

export const getThumbnail =  (recipeId, mediaId) => {
    return dispatch => {
        const url = "/rcp/app/sync/media/stream/" + mediaId;
        const options = {
            action: response => {return {recipeId: recipeId, thumbnail: URL.createObjectURL(response.data)}}, 
            extra: {responseType: 'blob'}
        };
        callAPI(dispatch, url, methodtype.GET, null, types.media, options);
    };
};

export const getMedia = (id) => {
    return dispatch => {
        const url = "/rcp/app/sync/media/stream/" + id;
        const options = {
            action: response => {return {media: URL.createObjectURL(response.data), reset: true}}, 
            extra: {responseType: 'blob'}
        };
        callAPI(dispatch, url, methodtype.GET, null, types.media, options);
    };
};

export const changeRecipeImageId = (id) => {
    return createAction(types.recipe.CHANGE, {key: 'imageId', value: id});
};

export const uploadMedia = (file) => {
    return dispatch => {
        const url = "rcp/app/sync/media/stream";
        const f = response => {dispatch(changeRecipeImageId(response.data.value))};
        const options = {
            action: () => {return {media: file.preview.url, reset: false}},
            headers: {"Content-Type": "application/octet-stream", "mediaType": file.type},
            successfns: {f}
        };
        callAPI(dispatch, url, methodtype.POST, file, types.media, options);
    };
};

export const clearMedia = () => {
    return createAction(types.media.CLEAR);
};

export const cancelEditMedia = (creating) => {
    return createAction(types.media.EDITCANCEL, {creating: creating});
};
import {updateObject} from '../../common/utilities';
import * as types from '../types';
import { createAction } from '../common';

const initialState = {
    popups: {}
};

const open = (state, action) => {
    const popup = state.popups[action.name] === undefined ? {} : {...state.popups[action.name]};
    popup.posX = action.posX;
    popup.posY = action.posY;
    const popups = {...state.popups, [action.name]: popup}
    return updateObject(state, {popups: popups});
};

const activate = (state, action) => {
    const popup = state.popups[action.name] === undefined ? {} : {...state.popups[action.name]};
    popup.active = true;
    if (isNaN(popup.posX)) popup.posX = 0;
    if (isNaN(popup.posY)) popup.posY = 0;
    const popups = {...state.popups, [action.name]: popup}
    return updateObject(state, {popups: popups});
};

const move = (state, action) => {
    let popups = {...state.popups};
    for(let key in popups) {
        if (popups[key].active) {
            popups[key].posX = popups[key].posX + action.movementX;
            popups[key].posY = popups[key].posY + action.movementY;
        };
    };
    return updateObject(state, {popups: popups});
};

const inactivate = (state) => {
    let popups = {...state.popups};
    for(let key in popups) {
        if (popups[key].active) {
            popups[key].active = false;
        };
    };
    return updateObject(state, {popups: popups});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.popup.ACTIVATE: return activate(state, action);
        case types.popup.INACTIVATE: return inactivate(state);
        case types.popup.MOVE: return move(state, action);
        case types.popup.OPEN: return open(state, action);
        default: return state;
    };
};

export default reducer;

export const openPopup = (name, posX, posY) => {
    return createAction(types.popup.OPEN, {name: name, posX: posX, posY: posY});
};

export const activatePopup = (name) => {
    return createAction(types.popup.ACTIVATE, {name: name});
};

export const inactivatePopup = () => {
    return createAction(types.popup.INACTIVATE);
};

export const movePopup = (movementX, movementY) => {
    return createAction(types.popup.MOVE, {movementX: movementX, movementY: movementY});
};
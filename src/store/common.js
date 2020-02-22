import {setErrorAndDispatch} from '../common/utilities';
import axios from '../axios/axios';

const process = (processors, object) => {
    if(processors === null) return;
    processors.forEach(processor => {processor(object)});
};

const call = (url, method, data, headers, extra, start, success, failure) => {
    process(start);
    const options = {url: url, method: method, data: data, headers: headers, ...extra};
    axios(options).then(response => {process(success, response);}).catch(error => {process(failure, error);});
};

export const createAction = (type, payloads) => {
    return {type: type, ...payloads};
};

const get = (options, field, otherwise = null) => {
    return options && options[field] ? options[field] : otherwise;
};

const getStart = (dispatch, types, options) => {
    const start = get(options, "start");
    const functions = get(options, "startfns");
    const main = start ? start : () => setErrorAndDispatch(dispatch, () => createAction(types.START));
    return Object.values({main, ...functions});
};

const getSuccess = (dispatch, types, options) => {
    const success = get(options, "success");
    const functions = get(options, "successfns");
    const main = success !== null ? success : response => dispatch(createAction(types.SUCCESS, get(options, "action")(response)));
    return Object.values({main, ...functions});
};

const getFailure = (dispatch, types, options) => {
    const failure = get(options, "failure");
    const functions = get(options, "failurefns");
    const main = failure ? failure : error => setErrorAndDispatch(dispatch, () => createAction(types.FAIL), error);
    return Object.values({main, ...functions});
};

export const callAPI = (dispatch, url, method, data, types, options) => {
    const start = getStart(dispatch, types, options);
    const success = getSuccess(dispatch, types, options);
    const failure = getFailure(dispatch, types, options);
    const headers = get(options, "headers", {});
    const extra = get(options, "extra", {});
    call(url, method, data, headers, extra, start, success, failure);
};
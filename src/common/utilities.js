import * as errorHandler from '../store/reducers/error';
import axios from '../axios/axios';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const copyObject = (source) => {
    let result = {};
    if(source instanceof Array) {
        const newArray = [];
        for (let item in source) {
            newArray.push(copyObject(source[item]));
        }
        return newArray;
    } else for (let key in source) {
        if (source[key] instanceof Array ) {
            const newArray = [];
            for (let item in source) {
                newArray.push(copyObject(source[item]));
            }
            result[key] = newArray;
        } else if (source[key] instanceof Object) {
            result[key] = copyObject(source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

export const compareObjects = (object1, object2) => {
    
    if (object1 == null && object2 == null) return true;
    if (object1 == null || object2 == null) return false;
    if (Object.keys(object1).length !== Object.keys(object2).length) return false;
    let result = true;
    for (let key in object1) {
        const obj1 = object1[key] instanceof Object;
        const obj2 = object2[key] instanceof Object;
        if (obj1 && obj1 === obj2) {
            result = compareObjects(object1[key], object2[key]);
            break;
        }
        if (obj1 !== obj2) {
            result = false;
            break;
        }
        if (object2[key] === undefined || object1[key] !== object2[key]) {
            result = false;
            break;
        }
    }
    return result;

};

export const validateValue = (value, rules) => {

    let isValid = true;
    let invalidReason = null;

    if (!rules) return [isValid, null];

    const test = value === undefined || value === null ? "" : value;

    if (isValid && (typeof test === "string") && rules.required && test.trim().length === 0) {
        invalidReason = "Required Field"
        isValid = false;
    }

    if (isValid && (typeof test === "string") && rules.minimumLength && test.trim().length < rules.minimumLength) {
        invalidReason = "Minimum Length " + rules.minimumLength;
        isValid = false;
    }

    if (isValid && (typeof test === "string") && rules.maximumLength && test.trim().length > rules.maximumLength) {
        invalidReason = "Maximum Length " + rules.maximumLength;
        isValid = false;
    }

    if (isValid && isNaN(test) && rules.type === "number") {
        invalidReason = "Must be numeric"
        isValid = false;
    }

    return [isValid, invalidReason];

};

export const validateForm = (data, validations) => {

    let result = true;

    for (let key in validations) {
        if (validations[key].validation) {
            let [valid] = [true];
            if(data[key]) {
                [valid] = [data[key].valid];
            } else {
                [valid] = validateValue(null, validations[key].validation);
            }
            result = result && valid;
        };
    };

    return result;

}

export const setErrorAndDispatch = (dispatch, target, error) => {
    if (error === undefined || error === null) {
        dispatch(errorHandler.clearError());
    } else {
        const err = {message: error.message, detail: (error.response === undefined ? null : error.response.data.message)};
        dispatch(errorHandler.setError(err.message, err.detail));
    }
    if (target !== undefined && target !== null) dispatch(target());
};

export const call = (url, method, data, initial, success, failure) => {

    if (initial !== null) initial();
    
    axios({url: url, method: method, data: data})
        .then(response => {
            if (success !== null) success(response);
        })
        .catch(error => {
            if (failure !== null) failure(error);
        });

};

export const logout = () => {

};

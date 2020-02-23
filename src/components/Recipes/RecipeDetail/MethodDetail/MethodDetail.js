import React from 'react';
import datatypes from '../../../../common/datatypes';
import Form from '../../../../containers/Form/Form';
import Buttons from '../../../UI/Buttons/Buttons';
import Panel from '../../../UI/Panel/Panel';
import {connect} from 'react-redux';
import {compareObjects, setErrorAndDispatch} from '../../../../common/utilities';
import * as actionCreators from '../../../../store/reducers/index';

const MethodDetail = (props) => {

    const changeHandler = (id, value) => {
        props.onChangeMethod(id, value);
    };

    let type = "";
    switch (props.MTD.datatype) {
        case datatypes.UPDATE:
            type = "Editing" + (props.hasMethodChanged ? " *" : "");
            break;
        case datatypes.DELETE:
            type = "Deleting";
            break;
        case datatypes.INSERT:
            type = "Creating";
            break;
        default:
            type = "Unknown";
    };

    const formsConfig = {
        status: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: type,
            label: 'Status'
        },
        sequence: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: (props.method && props.method.sequence ? props.method.sequence : ''),
            label: 'Current Sequence'
        },
        detail: {
            elementType: 'textarea',
            elementConfig: {
                type: 'text',
                placeholder: '',
                readOnly: props.MTD.datatype === datatypes.DELETE,
            },
            value: (props.method && props.method.detail ? props.method.detail : ''),
            validation: {
               required: true
            },
            label: 'Detail',
            changeHandler: changeHandler
        },
        createdOn: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: (props.method === null || props.method.createdOn === undefined ? '' : new Date(props.method.createdOn).toLocaleString('en-GB')),
            label: 'Created On'
        },
        updatedOn: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: (props.method === null || props.method.updatedOn === undefined ? '' : new Date(props.method.updatedOn).toLocaleString('en-GB')),
            label: 'Updated On'
        },
    }

    const cancelHandler = () => {
        props.onCancelEditMethod();
    };

    const saveExitHandler = () => {
        props.onSaveMethod(props.RCP.recipe.id, props.MTD.method, props.MTD.datatype);
    };

    const deleteHandler = () => {
        props.onSaveMethod(props.RCP.recipe.id, props.MTD.method, props.MTD.datatype);
    };

    const notifyValidHandler = (valid) => {
        props.onValidate(valid);
    };

    const buttonsConfig = {
        cancel: {
            label: 'Cancel',
            enabled: true,
            clickHandler: cancelHandler
        },
        saveExit: {
            label: 'Save & Exit',
            visible: props.MTD.datatype !== datatypes.DELETE,
            enabled: props.MTD.datatype !== datatypes.DELETE && props.hasMethodChanged && props.MTD.valid,
            clickHandler: saveExitHandler
        },
        confirm: {
            label: 'Confirm',
            visible: props.MTD.datatype === datatypes.DELETE,
            clickHandler: deleteHandler
        }
    };

    return (
        <Panel title="Method" mouseDown={props.mouseDown}>
            <Form data={props.MTD} config={formsConfig} notifyValid={notifyValidHandler} labelWidth="120px" inputWidth="calc(100% - 150px)"/>
            <Buttons config={buttonsConfig}/>
        </Panel>
    );
};

const mapStateToProps = state => {
    return {
        MTD: state.MTD,
        LKP: state.LKP,
        RCP: state.RCP,
        hasMethodChanged: !compareObjects(state.MTD.method, state.MTD.oldmethod)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeMethod: (key, value) => setErrorAndDispatch(dispatch, () => actionCreators.changeMethod(key, value)),
        onSaveMethod: (recipeId, method, mode) => setErrorAndDispatch(dispatch, () => actionCreators.saveMethod(recipeId, method, mode)),
        onCancelEditMethod: () => setErrorAndDispatch(dispatch, actionCreators.cancelEditMethod),
        onValidate: (valid) => dispatch(actionCreators.setMethodValid(valid))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MethodDetail);
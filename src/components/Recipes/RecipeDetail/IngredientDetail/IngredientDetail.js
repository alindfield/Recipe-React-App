import React, {useEffect} from 'react';
import datatypes from '../../../../common/datatypes';
import Form from '../../../../containers/Form/Form';
import Buttons from '../../../UI/Buttons/Buttons';
import Panel from '../../../UI/Panel/Panel';
import {connect} from 'react-redux';
import {compareObjects, setErrorAndDispatch} from '../../../../common/utilities';
import * as actionCreators from '../../../../store/reducers/index';

const IngredientDetail = (props) => {

    useEffect(() => {
        if (props.LKP.units === null && !props.LKP.units.loading) {
            props.onGetUnits();
        }
    });

    const changeHandler = (id, value) => {
        props.onChangeIngredient(id, value);
    };

    let type = "";
    switch (props.ING.datatype) {
        case datatypes.UPDATE:
            type = "Editing" + (props.hasIngredientChanged ? " *" : "");
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

    const selectHandler = (selectedId) => {
        const newUnit = {...props.ING.ingredient.unit, id: selectedId}
        props.onChangeIngredient("unit", newUnit);
    };
    
    const cancelHandler = () => {
        props.onCancelEditIngredient();
    };

    const saveExitHandler = () => {
        props.onSaveIngredient(props.RCP.recipe.id, props.ING.ingredient, props.ING.datatype);
    };

    const deleteHandler = () => {
        props.onSaveIngredient(props.RCP.recipe.id, props.ING.ingredient, props.ING.datatype);
    };

    const notifyValidHandler = (valid) => {
        props.onValidate(valid);
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
            value: (props.ingredient && props.ingredient.sequence ? props.ingredient.sequence : ''),
            label: 'Current Sequence'
        },
        quantity: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: '',
                readOnly: props.ING.datatype === datatypes.DELETE,
            },
            inputWidth: '160px',
            value: (props.ingredient && props.ingredient.quantity ? props.ingredient.quantity : ''),
            validation: {
               required: true,
               type: "number"
            },
            label: 'Quantity',
            changeHandler: changeHandler
        },
        detail: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: '',
                readOnly: props.ING.datatype === datatypes.DELETE,
            },
            value: (props.ingredient && props.ingredient.detail ? props.ingredient.detail : ''),
            validation: {
               required: true,
               maximumLength: 80
            },
            label: 'Detail',
            changeHandler: changeHandler
        },
        unit: {
            elementType: 'list',
            elementConfig: {
                items: props.LKP.units.list,
                selectHandler: selectHandler,
                getId: (item) => {return item.id},
                getLabel: (item) => {return item.description},
                readOnly: props.ING.datatype === datatypes.DELETE,
            },
            inputWidth: '160px',
            label: 'Unit',
            value: (props.ingredient && props.ingredient.unit ? props.ingredient.unit : '')
        },
        createdOn: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: (props.ingredient === null || props.ingredient.createdOn === undefined ? '' : new Date(props.ingredient.createdOn).toLocaleString('en-GB')),
            label: 'Created On'
        },
        updatedOn: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: (props.ingredient === null || props.ingredient.updatedOn === undefined ? '' : new Date(props.ingredient.updatedOn).toLocaleString('en-GB')),
            label: 'Updated On'
        },
    }

    const buttonsConfig = {
        cancel: {
            label: 'Cancel',
            enabled: true,
            clickHandler: cancelHandler
        },
        saveExit: {
            label: 'Save & Exit',
            visible: props.ING.datatype !== datatypes.DELETE,
            enabled: props.ING.datatype !== datatypes.DELETE && props.hasIngredientChanged && props.ING.valid,
            clickHandler: saveExitHandler
        },
        confirm: {
            label: 'Confirm',
            visible: props.ING.datatype === datatypes.DELETE,
            clickHandler: deleteHandler
        }
    };

    return (
        <Panel title="Ingredient" mouseDown={props.mouseDown}>
            <Form data={props.ING} config={formsConfig} notifyValid={notifyValidHandler} labelWidth="120px" inputWidth="calc(100% - 150px)"/>
            <Buttons config={buttonsConfig}/>
        </Panel>
    );
};

const mapStateToProps = state => {
    return {
        ING: state.ING,
        LKP: state.LKP,
        RCP: state.RCP,
        hasIngredientChanged: !compareObjects(state.ING.ingredient, state.ING.oldingredient)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetUnits: () => dispatch(actionCreators.getUnits()),
        onChangeIngredient: (key, value) => setErrorAndDispatch(dispatch, () => actionCreators.changeIngredient(key, value)),
        onSaveIngredient: (recipeId, ingredient, mode) => setErrorAndDispatch(dispatch, () => actionCreators.saveIngredient(recipeId, ingredient, mode)),
        onCancelEditIngredient: () => setErrorAndDispatch(dispatch, actionCreators.cancelEditIngredient),
        onValidate: (valid) => dispatch(actionCreators.setIngredientValid(valid))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IngredientDetail);
import React, {useEffect, useRef} from 'react';
import classes from './RecipeDetail.css';
import {connect} from 'react-redux';
import Error from '../../Error/Error';
import {Tab, TabItem} from '../../UI/Tab/Tab';
import Form from '../../../containers/Form/Form';
import Buttons from '../../UI/Buttons/Buttons';
import * as actionCreators from '../../../store/reducers/index';
import Auxiliary from '../../../hoc/Auxiliary';
import Ingredients from './Ingredients/Ingredients';
import Methods from './Methods/Methods';
import datatypes from '../../../common/datatypes';
import {DragDropContext} from 'react-beautiful-dnd';
import SectionHeading from '../../SectionHeading/SectionHeading'; 
import {compareObjects, setErrorAndDispatch, copyObject} from '../../../common/utilities';
import modetype from '../../../common/datatypes';
import {Redirect} from 'react-router-dom';
import Modal from '../../UI/Modal/Modal';
import IngredientDetail from './IngredientDetail/IngredientDetail';
import MethodDetail from './MethodDetail/MethodDetail';
import Media from '../../Media/Media';
import Confirm from '../../UI/Confirm/Confirm';

const RecipeDetail = (props) => {

    let ref = useRef(1);

    useEffect(() => {
        if (props.ING.retrieve) {
            props.onGetIngredients(props.RCP.recipe.id);
        }
        if (props.MTD.retrieve) {
            props.onGetMethods(props.RCP.recipe.id);
        }
    });

    const tabs = [
        {id: 1, display: 'Recipe'},
        {id: 2, display: 'Image'},
        {id: 3, display: 'Ingredients'},
        {id: 4, display: 'Method'}
    ];

    const tabline = tabs.map(tab => {
        return (
            <TabItem key={tab.id} id={tab.id} label={tab.display}/>
        );
    });

    const clearHandler = () => {
        props.onChangeMedia(null);
        props.onClearMedia();
    };

    const fileUploadHandler = (files) => {
        if (files.length === 1) props.onUploadMedia(files[0]);
    };

    const errorHandler = (error) => {
        props.onError({message: error.message});
    };

    const closeIngredientHandler = () => {
    };

    const closeMethodHandler = () => {
    };

    const closeConfirmHandler = () => {
    };

    const tabClickHandler = (selectedId) => {
        props.onSetTab(selectedId);
    };

    const changeHandler = (key, value) => {
        props.onChangeRecipe(key, value);
    };

    const clickEditHandler = () => {
        props.onEditRecipe();
    };

    const clickDeleteHandler = () => {
        props.onDeleteRecipe();
    };

    const clickCancelEditHandler = () => {
        if(ref.current !== null) ref.current.reset();
        props.onCancelEditRecipe();
    };

    const clickBackHandler = () => {
        props.onBack();
    };

    const saveHandler = () => {
        props.onSaveRecipe(props.RCP.recipe, false, (props.RCP.datatype === datatypes.INSERT ? modetype.INSERT : modetype.UPDATE));
    };

    const saveExitHandler = () => {
        props.onSaveRecipe(props.RCP.recipe, true, (props.RCP.datatype === datatypes.INSERT ? modetype.INSERT : modetype.UPDATE));
    };

    const deleteIngredientHandler = (id) => {
        props.onGetIngredient(props.RCP.recipe.id, id, datatypes.DELETE);
    };

    const editIngredientHandler = (id) => {
        props.onGetIngredient(props.RCP.recipe.id, id, datatypes.UPDATE);
    };

    const createIngredientHandler = () => {
        props.onCreateIngredient();
    };

    const deleteMethodHandler = (id) => {
        props.onGetMethod(props.RCP.recipe.id, id, datatypes.DELETE);
    };

    const editMethodHandler = (id) => {
        props.onGetMethod(props.RCP.recipe.id, id, datatypes.UPDATE);
    };

    const createMethodHandler = () => {
        props.onCreateMethod();
    };

    const notifyValidHandler = (valid) => {
        props.onValidate(valid);
    };
    
    const dragEndHandler = (result) => {

        const {type, destination, source} = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'ingredient') {
            const ingredients = copyObject(props.ING.ingredients);
            const ingredient = ingredients[source.index];           
            ingredients.splice(source.index, 1);
            ingredients.splice(destination.index, 0, ingredient);
            props.onSetIngredients(ingredients);
            props.onOrderIngredients(props.RCP.recipe.id, ingredients);
        }

        if (type === 'method') {
            const methods = copyObject(props.MTD.methods);
            const method = methods[source.index];           
            methods.splice(source.index, 1);
            methods.splice(destination.index, 0, method);
            props.onSetMethods(methods);
            props.onOrderMethods(props.RCP.recipe.id, methods);
        }

    };

    const nbsp = String.fromCharCode(160);

    const getIngredientSummary = () => {
        const maximum = 6;
        if (props.ING.ingredients === null || props.ING.ingredients.length === 0) return null;
        return (
            <Auxiliary>
                {props.ING.ingredients.filter((_, index) => index < maximum).map((ingredient, index) => 
                    <div style={{textAlign: 'left', display: 'flex', flexDirection: 'row'}} key={index}>
                        <div style={{width: "60px"}}>{ingredient.quantity} {ingredient.unit === undefined ? "" : ingredient.unit.code}</div>
                        <div>{ingredient.detail.replace(' ', nbsp)}</div>
                    </div>)
                }
                {props.ING.ingredients.filter((_, index) => index === maximum).map((index) => 
                    <div style={{textAlign: 'center'}} key={index}>
                            more...
                    </div>)
                }
            </Auxiliary>
        );
    };

    const getMethodSummary = () => {
        const maximum = 3;
        if (props.MTD.methods === null || props.MTD.methods.length === 0) return null;
        return (
            <Auxiliary>
                {props.MTD.methods.filter((_, index) => index < maximum).map((method, index) => 
                <div style={{textAlign: 'left'}} key={index}>
                        {index + 1}&nbsp;{method.detail.replace(' ', nbsp)}
                </div>)}     
                {props.MTD.methods.filter((_, index) => index === maximum).map((index) => 
                <div style={{textAlign: 'center'}} key={index}>
                        more...
                </div>)}
            </Auxiliary>
        );
    };

    const formConfig = {
        status: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: (props.RCP.datatype === datatypes.UPDATE ? 'Editing' + (props.hasRecipeChanged ? " *" : "") : (props.RCP.datatype === datatypes.INSERT ? 'Creating' : '')),
            label: 'Status',
            display: props.RCP.datatype === datatypes.UPDATE || props.RCP.datatype === datatypes.INSERT 
        },
        title: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: '',
                readOnly: props.RCP.datatype !== datatypes.UPDATE && props.RCP.datatype !== datatypes.INSERT
            },
            value: (props.RCP.recipe && props.RCP.recipe.title ? props.RCP.recipe.title : ''),
            validation: {
               required: true
            },
            label: 'Title',
            changeHandler: changeHandler
        },
        description: {
            elementType: 'textarea',
            elementConfig: {
                readOnly: props.RCP.datatype !== datatypes.UPDATE && props.RCP.datatype !== datatypes.INSERT,
            },
            value: (props.RCP.recipe && props.RCP.recipe.description ? props.RCP.recipe.description : ''),
            label: 'Description',
            changeHandler: changeHandler
        },
        createdOn: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true,
            },
            inputWidth: '160px',
            value: (props.RCP.recipe === null || props.RCP.recipe.createdOn === undefined ? '' : new Date(props.RCP.recipe.createdOn).toLocaleString('en-GB')),
            label: 'Created On'
        },
        updatedOn: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            value: (props.RCP.recipe === null || props.RCP.recipe.updatedOn === undefined ? '' : new Date(props.RCP.recipe.updatedOn).toLocaleString('en-GB')),
            label: 'Updated On'
        },
        ingredients: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            tooltip: getIngredientSummary,
            value: (props.ING.ingredients === null ? 0 : props.ING.ingredients.length),
            label: 'Ingredients'
        },
        methods: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                readOnly: true
            },
            inputWidth: '160px',
            tooltip: getMethodSummary,
            value: (props.MTD.methods === null ? 0 : props.MTD.methods.length),
            label: 'Method'
        }        
    };

    const buttonsConfig = {
        edit: {
            label: 'Edit',
            enabled: props.RCP.datatype !== datatypes.UPDATE && props.RCP.datatype !== datatypes.INSERT,
            clickHandler: clickEditHandler
        },
        delete: {
            label: 'Delete',
            enabled: props.RCP.datatype !== datatypes.UPDATE && props.RCP.datatype !== datatypes.INSERT,
            clickHandler: clickDeleteHandler
        },
        cancel: {
            label: 'Cancel',
            enabled: props.RCP.datatype === datatypes.UPDATE || props.RCP.datatype === datatypes.INSERT,
            clickHandler: clickCancelEditHandler
        },
        save: {
            label: 'Save',
            enabled: props.hasRecipeChanged && props.RCP.valid,
            clickHandler: saveHandler
        },
        saveExit: {
            label: 'Save & Exit',
            enabled: props.hasRecipeChanged && props.RCP.valid,
            clickHandler: saveExitHandler
        },
        back: {
            label: 'Back',
            enabled: props.RCP.datatype !== datatypes.UPDATE && props.RCP.datatype !== datatypes.INSERT,
            clickHandler: clickBackHandler
        },
        //pdf: {
        //    label: 'PDF'
        //}
    };

    let detail = null;

    if (props.RCP.selectedId === 1) {
        const media = props.MED.media ? <div className={classes.TopRightImage}><img src={props.MED.media} alt=""/></div> : null;
        detail = (
            <Auxiliary>
                <div className={classes.Top}>
                    <div className={classes.TopLeft}>
                        <Form ref={ref} config={formConfig} notifyValid={notifyValidHandler} labelWidth="120px" inputWidth="calc(100% - 150px)"/>
                    </div>
                    <div className={classes.TopRight}>{media}</div>
                </div>
            </Auxiliary>
        );
    };

    if (props.RCP.selectedId === 2) {
        detail = (
            <Auxiliary>
                <div className={classes.Image}>
                    <Media 
                        media={props.MED.media} 
                        errorHandler={errorHandler} 
                        clearHandler={clearHandler} 
                        fileUploadHandler={fileUploadHandler}
                        editing={props.RCP.datatype === datatypes.UPDATE}
                        creating={props.RCP.datatype === datatypes.INSERT}
                    />  
                </div>
            </Auxiliary>
        );
    };

    if (props.RCP.selectedId === 3) {
        detail = (
            <Auxiliary>
                <div className={classes.SubHeader}>
                    <SectionHeading createHandler={createIngredientHandler} enabled={props.RCP.datatype === datatypes.UPDATE}/>
                </div>
                <div className={classes.Sub}>
                    <Ingredients 
                        ingredients={props.ING.ingredients} 
                        readonly={props.RCP.datatype !== datatypes.UPDATE && props.RCP.datatype !== datatypes.INSERT} 
                        deleteHandler={deleteIngredientHandler} 
                        editHandler={editIngredientHandler}
                    />
                </div>                
            </Auxiliary>
        );
    };

    if (props.RCP.selectedId === 4) {
        detail = (
            <Auxiliary>
                <div className={classes.SubHeader}>
                    <SectionHeading createHandler={createMethodHandler} enabled={props.RCP.datatype === datatypes.UPDATE}/>
                </div>
                <div className={classes.Sub}>
                    <Methods 
                        methods={props.MTD.methods}
                        readonly={props.RCP.datatype !== datatypes.UPDATE && props.RCP.datatype !== datatypes.INSERT}
                        deleteHandler={deleteMethodHandler} 
                        editHandler={editMethodHandler}
                    />
                </div>
            </Auxiliary>
        );
    };

    const modalClickHandler = (_, key) => {
    };

    const ingredientModalStyles = {backgroundColor: "lightgray", position: 'absolute', width: "600px", border: "1px solid black", left: 100, top: 100};
    const ingredientPopupModal = (
        <Modal name="ING" mouseDown={modalClickHandler} open={props.ING.datatype !== null} closeHandler={closeIngredientHandler} modalstyles={ingredientModalStyles}>
            <IngredientDetail ingredient={props.ING.ingredient} datatype={props.ING.datatype}/> 
        </Modal>
    );

    const methodModalStyles = {backgroundColor: "lightgray", position: 'absolute', width: "600px", border: "1px solid black", left: 100, top: 100};
    const methodPopupModal = (
        <Modal name="MTD" mouseDown={modalClickHandler} open={props.MTD.datatype !== null} closeHandler={closeMethodHandler} modalstyles={methodModalStyles}>
            <MethodDetail method={props.MTD.method} datatype={props.MTD.datatype}/> 
        </Modal>
    );

    const clickDeleteConfirmHandler = () => {
        props.onSaveRecipe(props.RCP.recipe, true, modetype.DELETE);
    };

    const clickDeleteCancelHandler = () => {
        props.onCancelEditRecipe();
    };

    const confirmStyles = {backgroundColor: "lightgray", width: "600px", border: "1px solid black"};
    const confirmModal = (
        <Modal name="DEL" mouseDown={modalClickHandler} open={props.RCP.datatype === datatypes.DELETE} center closeHandler={closeConfirmHandler} modalstyles={confirmStyles}>
            <Confirm deleteConfirmHandler={clickDeleteConfirmHandler} deleteCancelHandler={clickDeleteCancelHandler} title="Confirm Delete"/>
        </Modal>
    );

    let output = <Redirect to="/" />

    if (props.RCP.recipe !== null || props.RCP.datatype === datatypes.INSERT) {
        output = (
            <DragDropContext onDragEnd={dragEndHandler}>
                <Error error={props.ERR}>
                    {ingredientPopupModal}
                    {methodPopupModal}
                    {confirmModal}
                    <div className={classes.RecipeDetail}>
                        <Tab selectedId={props.RCP.selectedId} onClick={tabClickHandler}>
                            {tabline}
                        </Tab>
                        <div className={classes.RecipeDetailFlex}>
                            {detail}
                            <div className={classes.Bottom}>
                                <Buttons config={buttonsConfig}/>
                            </div>
                        </div>
                    </div>
                </Error>
            </DragDropContext>
        );
    };

    return output;

};

const mapStateToProps = state => {
    return {
        RCP: state.RCP,
        ING: state.ING,
        MTD: state.MTD,
        ERR: state.ERR,
        MED: state.MED,
        hasRecipeChanged: !compareObjects(state.RCP.recipe, state.RCP.oldrecipe)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetTab: (selectionId) => dispatch(actionCreators.setRecipeTab(selectionId)),
        onEditRecipe: () => setErrorAndDispatch(dispatch, actionCreators.editRecipe),
        onDeleteRecipe: () => setErrorAndDispatch(dispatch, actionCreators.deleteRecipe),
        onCancelEditRecipe: () => setErrorAndDispatch(dispatch, actionCreators.cancelEditRecipe),
        onCancelEditMedia: (creating) => dispatch(actionCreators.cancelEditMedia(creating)),
        onChangeRecipe: (key, value) => setErrorAndDispatch(dispatch, () => actionCreators.changeRecipe(key, value)),
        onBack: () => setErrorAndDispatch(dispatch, actionCreators.clearRecipe),
        onSaveRecipe: (recipe, exit, mode) => setErrorAndDispatch(dispatch, () => actionCreators.saveRecipe(recipe, exit, mode)),
        onValidate: (valid) => dispatch(actionCreators.setEditRecipeValid(valid)),
        onUploadMedia: (file) => dispatch(actionCreators.uploadMedia(file)),
        onClearMedia: () => dispatch(actionCreators.clearMedia()),
        onError: (error) => setErrorAndDispatch(dispatch, null, error),
        onChangeMedia: (id) => setErrorAndDispatch(dispatch, () => actionCreators.changeRecipeImageId(id)),
        onSetIngredients: (result) => dispatch(actionCreators.setIngredients(result)),
        onOrderIngredients: (recipeId, ingredients) => dispatch(actionCreators.orderIngredients(recipeId, ingredients)),
        onSetMethods: (result) => dispatch(actionCreators.setMethods(result)),
        onOrderMethods: (recipeId, methods) => dispatch(actionCreators.orderMethods(recipeId, methods)),
        onGetIngredient: (recipeId, ingredientId, datatype) => setErrorAndDispatch(dispatch, () => actionCreators.getIngredient(recipeId, ingredientId, datatype)),
        onGetMethod: (recipeId, methodId, datatype) => setErrorAndDispatch(dispatch, () => actionCreators.getMethod(recipeId, methodId, datatype)),
        onCancelEditIngredient: () => setErrorAndDispatch(dispatch, actionCreators.cancelEditIngredient),
        onCancelEditMethod: () => setErrorAndDispatch(dispatch, actionCreators.cancelEditMethod),
        onGetIngredients: (recipeId) => setErrorAndDispatch(dispatch, () => actionCreators.getIngredients(recipeId)),
        onGetMethods: (recipeId) => setErrorAndDispatch(dispatch, () => actionCreators.getMethods(recipeId)),
        onCreateIngredient: () => setErrorAndDispatch(dispatch, actionCreators.createIngredient),
        onCreateMethod: () => setErrorAndDispatch(dispatch, actionCreators.createMethod)        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetail);
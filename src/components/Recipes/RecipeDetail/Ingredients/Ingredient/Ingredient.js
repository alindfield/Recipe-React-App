import React from 'react';
import './Ingredient.css';
import {Draggable} from 'react-beautiful-dnd';

const Ingredient = React.memo((props) => {
    return (
        <Draggable draggableId={props.ingredient.id.toString()} index={props.index} type="ingredient" isDragDisabled={props.readonly}>
            {(provided) => {
                return (
                    <div className="ingredient" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <div className="ingredient-left">
                            <div className="ingredient-quantity">{props.ingredient.quantity}{props.ingredient.unit === undefined ? "" : props.ingredient.unit.code}</div>
                            <div>{props.ingredient.detail}</div>
                        </div>
                        <div className="ingredient-right">
                            <button disabled={props.readonly} onClick={() => props.editHandler(props.ingredient.id)}>✎</button>
                            <button disabled={props.readonly} onClick={() => props.deleteHandler(props.ingredient.id)}>✖</button>
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
});

export default Ingredient;
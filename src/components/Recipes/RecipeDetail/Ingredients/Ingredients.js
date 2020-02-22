import React from 'react'
import Ingredient from './Ingredient/Ingredient';
import {Droppable} from 'react-beautiful-dnd';
import './Ingredients.css';

const ingredients = React.memo((props) => {

    let output = null;

    if(props.ingredients !== null) {
        output = props.ingredients.map((ingredient, index) => {
            return (
                <Ingredient 
                    key={ingredient.id} 
                    ingredient={ingredient} 
                    index={index} 
                    readonly={props.readonly} 
                    deleteHandler={props.deleteHandler}
                    editHandler={props.editHandler}
                />
            );
        });
    };

    return (
        <Droppable droppableId={"ingredients"} type="ingredient">
            {(provided) => {
                return (
                    <div className="ingredients" ref={provided.innerRef} {...provided.droppableProps}>
                        {output}
                        {provided.placeholder}
                    </div>
                );
            }}
        </Droppable>
    );

});

export default ingredients;
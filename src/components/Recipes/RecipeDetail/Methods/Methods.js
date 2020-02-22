import React from 'react';
import Method from './Method/Method';
import {Droppable} from 'react-beautiful-dnd';

const methods = React.memo((props) => {

    let output = null;

    if (props.methods !== null) {
        output = props.methods.map((method, index) => {
            return (
                <Method 
                    key={method.id} 
                    method={method} 
                    index={index} 
                    readonly={props.readonly}
                    deleteHandler={props.deleteHandler}
                    editHandler={props.editHandler}
                />
            );
        });
    };

    return (
        <Droppable droppableId={"methods"} type="method">
            {(provided) => {
                return (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {output}
                        {provided.placeholder}
                    </div>
                );
            }}
        </Droppable>
    );
});

export default methods;

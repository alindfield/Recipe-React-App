import React from 'react';
import './Method.css';
import {Draggable} from 'react-beautiful-dnd';

const method = React.memo((props) => {
    return (
        <Draggable draggableId={props.method.id.toString()} index={props.index} type="method" isDragDisabled={props.readonly}>
            {(provided) => {
                return (
                    <div className="method" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <div className="method-left">
                            <div className="method-contentleft">{props.index + 1}</div>
                            <div className="method-contentright">{props.method.detail}</div>
                        </div>
                        <div className="method-right">
                            <button disabled={props.readonly} onClick={() => props.editHandler(props.method.id)}>✎</button>
                            <button disabled={props.readonly} onClick={() => props.deleteHandler(props.method.id)}>✖</button>
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
});

export default method;
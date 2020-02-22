import React from 'react';
import classes from './Method.css';
import {Draggable} from 'react-beautiful-dnd';

const method = React.memo((props) => {
    return (
        <Draggable draggableId={props.method.id} index={props.index} type="method" isDragDisabled={props.readonly}>
            {(provided) => {
                return (
                    <div className={classes.Method} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <div className={classes.Left}>
                            <div className={classes.ContentLeft}>{props.index + 1}</div>
                            <div className={classes.ContentRight}>{props.method.detail}</div>
                        </div>
                        <div className={classes.Right}>
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
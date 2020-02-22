import React from 'react';
import classes from './Panel.css';

const Panel = (props) => {
    return (
        <div>
            <div>
                <h2 onMouseDown={(event) => props.mouseDown(event, props.name)} className={classes.Header}>{props.title}</h2>
            </div>
            {props.children}
        </div>
    );
};

export default Panel;
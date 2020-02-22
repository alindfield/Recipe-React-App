import React from 'react';
import './Panel.css';

const Panel = (props) => {
    return (
        <div>
            <div>
                <h2 onMouseDown={(event) => props.mouseDown(event, props.name)} className="panel-header">{props.title}</h2>
            </div>
            {props.children}
        </div>
    );
};

export default Panel;
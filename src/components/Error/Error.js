import React from 'react';
import classes from './Error.css';

const error = (props) => {

    let error = null;
    
    if (props.error !== undefined && props.error.error) {
        error = (
            <div className={classes.Top}>
                <div>{props.error.message}</div>
                {props.error.detail !== undefined ? <div>{props.error.detail}</div> : null}
            </div>
        );
    } else {
        /*error = (
            <div className={classes.Top}>
                <p>No Error</p>
                <p>No error</p>
                <br />
            </div>
        );*/
    };

    return (
        <div className={classes.Error}>
            {error}
            <div className={classes.Bottom}>
                {props.children}
            </div>
        </div>
    );
};

export default error;
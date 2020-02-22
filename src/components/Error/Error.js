import React from 'react';
import './Error.css';

const error = (props) => {

    let error = null;
    
    if (props.error !== undefined && props.error.error) {
        error = (
            <div className="error-top">
                <div>{props.error.message}</div>
                {props.error.detail !== undefined ? <div>{props.error.detail}</div> : null}
            </div>
        );
    } else {
        /*error = (
            <div className="Top">
                <p>No Error</p>
                <p>No error</p>
                <br />
            </div>
        );*/
    };

    return (
        <div className="error">
            {error}
            <div className="error-bottom">
                {props.children}
            </div>
        </div>
    );
};

export default error;
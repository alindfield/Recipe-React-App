import React from 'react';
import classes from './Buttons.css';

const buttons = (props) => {

    const buttons = [];

    for (let key in props.config) {
        buttons.push ({
            id: key,
            config: props.config[key]
        });
    }

    return (
        <div className={classes.Buttons}>
            {buttons.map(element => {                    
                const style = element.config.visible === undefined || element.config.visible ? {} : {"display": "none"};
                return (
                    <button 
                        style={style}
                        key={element.id}          
                        type="button"
                        disabled={element.config.enabled !== undefined && !element.config.enabled}
                        onClick={element.config.clickHandler} {...element.config.elementConfig}>{element.config.label}</button>
                )
            })}
        </div>
    );
};

export default buttons;
import React from 'react';
import './Buttons.css';

const buttons = (props) => {

    const buttons = [];

    for (let key in props.config) {
        buttons.push ({
            id: key,
            config: props.config[key]
        });
    }

    return (
        <div className="buttons">
            {buttons.map(element => {                    
                const style = element.config.visible === undefined || element.config.visible ? {} : {"display": "none"};
                return (
                    <button 
                        style={style}
                        key={element.id}          
                        type="buttons-button"
                        disabled={element.config.enabled !== undefined && !element.config.enabled}
                        onClick={element.config.clickHandler} {...element.config.elementConfig}>{element.config.label}</button>
                )
            })}
        </div>
    );
};

export default buttons;
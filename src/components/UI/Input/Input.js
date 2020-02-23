import React, {memo, useReducer, useRef} from 'react';
import ReactDOM from 'react-dom';
import './Input.css';
import List from '../List/List';

const Input = (props) => {
    
    let inputRef = useRef(1);

    const initialState = {
        posX: 0,
        posY: 0,
        visible: false,
        class: null
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'update': return {posX: action.posX, posY: action.posY, visible: action.visible, class: action.class};
            default: return state;
        };
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const changeHandler = (event) => {
        let value = event.target.value;
        if(props.config.validation && props.config.validation.type) {
            if(props.config.validation.type === "number") {
                const pos = value.length;
                if(value.substring(pos - 1, pos) !== '.') value = Number(event.target.value);
            }
        }
        props.changeHandler(props.id, value);
    };

    const blurHandler = (event) => {
        props.blurHandler(props.id, event.target.value);
        dispatch({type: 'update', posX: state.posX, posY: state.posY, visible: false, class: null});
    };

    const mouseEnterHandler = (ref) => {
        const square = ReactDOM.findDOMNode(ref).getBoundingClientRect();
        dispatch({type: 'update', posX: square.right + 10, posY: square.top - 10, visible: true, class: "input-tooltipopen"});
    };

    const mouseLeaveHandler = () => {
        dispatch({type: 'update', posX: state.posX, posY: state.posY, visible: false, class: "input-tooltipclose"});
    };

    let inputElement = null;
    const inputClasses = ["input-input"];

    let error = null;

    if ((props.data ? !props.data.valid : true) && (props.data ? props.data.touched : false)) {
        error = props.data.reason;
        inputClasses.push("input-invalid");
    } else {
        inputClasses.push("input-valid");
    }

    const ref = (ref) => {
        inputRef = ref;
        if(props.updateRef !== undefined) props.updateRef(ref);
    };

    switch (props.config.elementType) {

        case ('input'):
            inputElement = <input 
                key={props.id}
                ref={ref}
                className={inputClasses.join(' ')}
                value={props.config.value === undefined ? '' : props.config.value}
                onChange={changeHandler}
                onBlur={blurHandler}
                onMouseEnter={() => mouseEnterHandler(inputRef)}
                onMouseLeave={mouseLeaveHandler}
                {...props.config.elementConfig}
            />;
            break;

        case ('textarea'):
            inputElement = <textarea 
                key={props.id} 
                ref={ref}
                className={inputClasses.join(' ')} 
                {...props.config.elementConfig} 
                value={props.config.value ? props.config.value : ''} 
                onChange={changeHandler}
                onBlur={blurHandler}
                onMouseEnter={() => mouseEnterHandler(inputRef)}
                onMouseLeave={mouseLeaveHandler}
            />
            break; 

        case ('select'):
            inputElement = (
                <select ref={ref} key={props.id} className={inputClasses.join(' ')} value={props.config.value} onChange={changeHandler} >
                    {props.config.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            );
            break;

        case ('list'):
            inputElement =                 
                <div className={inputClasses.join(' ')} style={{width: props.inputWidth}}>
                    <List 
                        inputWidth={props.inputWidth}
                        changeHandler={props.changeHandler}
                        id={props.id}
                        value={props.config.value ? props.config.value : ''}
                        {...props.config.elementConfig} 
                        readOnly={props.config.elementConfig.readOnly}
                    />
                </div>;
            break;

        default:
            inputElement = null;
    }

    const left = "calc(" + props.labelWidth + " + 20px)";
    const errorTag = error === null ? null: <div style={{left: left}} className="input-error">{error}</div>;

    const style = {left: state.posX, top: state.posY, opacity: state.visible ? "1" : "0"};
    const toolClasses = ["input-tooltip"];
    
    if (state.class !== null) toolClasses.push(state.class);

    const toolTag = props.config.tooltip === undefined || props.config.tooltip() === null ? null : <div style={style} className={toolClasses.join(' ')}>{props.config.tooltip()}</div>;

    return (
        <div className="input">
            <div className="input-row">
                <div style={{width: props.labelWidth}} className="input-label">
                    {props.config.label}
                </div>
                <div style={{width: props.inputWidth}} className="input-element">
                    {inputElement}
                    {toolTag}
                </div>                
            </div>
            <div className="input-row">
                {errorTag}
            </div>
        </div>
    );

};

export default memo(Input);
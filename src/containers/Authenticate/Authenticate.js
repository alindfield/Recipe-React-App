import React, {useEffect, useRef} from 'react';
import Error from '../../components/Error/Error';
import {Tab, TabItem} from '../../components/UI/Tab/Tab';
import Form from '../Form/Form';
import Buttons from '../../components/UI/Buttons/Buttons';
import Auxiliary from '../../hoc/Auxiliary';
import {connect} from 'react-redux';
import {setErrorAndDispatch} from '../../common/utilities';
import * as actionCreators from '../../store/reducers/index';
import './Authenticate.css';

const Authenticate = (props) => {

    useEffect(() => {
        if ((document.activeElement !== userRef && document.activeElement !== passRef) || props.ERR.error) {
            userRef.focus();
        }
    });

    let userRef = useRef(0);
    let passRef = useRef(1);
    let loginRef = useRef(2);

    const tabs = [
        {id: 1, display: 'Log In'},
    ];

    const tabline = tabs.map(tab => {
        return (
            <TabItem key={tab.id} id={tab.id} label={tab.display}/>
        );
    });

    const tabClickHandler = (id) => {
        props.onSetAuthentication("selectedId", id);
    };

    const changeHandler = (id, value) => {
        props.onSetAuthentication(id, value);
    }

    const submitHandler = () => {
        props.onLogin(props.AUT.userId, props.AUT.password);
    };

    const notifyValidHandler = (valid) => {
        props.onValidate(valid);
    };

    const keyDownHandler = (event, action) => {
        if (event.key === "Enter") {
            event.preventDefault();
            action();
        };
    };

    const formsConfig = {
        userId: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                onKeyDown: (event) => keyDownHandler(event, () => {passRef.focus()})
            },
            tooltip: () => 'Enter user Id',
            updateRef: ref => {userRef = ref},
            value: props.AUT.userId === null ? '' : props.AUT.userId,
            validation: {
                required: true
            },
            label: 'User Id',
            changeHandler: changeHandler
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                onKeyDown: (event) => keyDownHandler(event, () => {loginRef.click()})
            },
            updateRef: ref => {passRef = ref},
            tooltip: () => {
                return (
                    <div>
                        Password of another league
                    </div>
                );
            },
            value: props.AUT.password === null ? '' : props.AUT.password,
            validation: {
                required: true
            },
            label: 'Password',
            changeHandler: changeHandler
        }
    };
    
    const buttonConfig = {
        login: {
            label: 'Login',
            elementConfig: {
                ref: (ref) => {loginRef = ref},
                accessKey: 'L'
            },
            enabled: props.AUT.valid,
            clickHandler: submitHandler
        }
    };

    const login = props.AUT.selectedId === 1 ? (
        <Auxiliary>
            <Form validate={props.AUT.validate} config={formsConfig} notifyValid={notifyValidHandler} data={props.AUT} labelWidth="80px" inputWidth="calc(100% - 110px)"/>
            <Buttons config={buttonConfig} />
        </Auxiliary>
    ) : null;

    return (
        <Error error={props.ERR}>
            <div className="authenticate">
                <Tab selectedId={props.AUT.selectedId} onClick={tabClickHandler}>
                    {tabline}
                </Tab>
                {login}
            </div>
        </Error>
    );

};

const mapStateToProps = state => {
    return {
        AUT: state.AUT,
        ERR: state.ERR
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetAuthentication: (id, value) => setErrorAndDispatch(dispatch, () => actionCreators.setAuthentication(id, value)),
        onValidate: (valid) => dispatch(actionCreators.setLoginValid(valid)),
        onLogin: (userId, password) => dispatch(actionCreators.login(userId, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
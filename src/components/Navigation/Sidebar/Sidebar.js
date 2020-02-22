import React from 'react';
import classes from './Sidebar.css';
import Buttons from '../../UI/Buttons/Buttons';
import Status from '../Status/Status';
import {connect} from 'react-redux';
import * as actionCreators from '../../../store/reducers/index';

const sidebar = (props) => {
    const logoffHandler = () => {
        props.onLogoff();
    };
    const config = {
        logoff: {
            label: 'Logoff',
            visible: props.isAuthenticated,
            clickHandler: logoffHandler
        }
    };
    return (
        <div className={classes.Sidebar}>
            <div className={classes.Session}>
                <Status />
            </div>
            <div className={classes.Buttons}>
                <Buttons config={config} />
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.AUT.sessionId !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogoff: () => dispatch(actionCreators.logoff())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(sidebar);
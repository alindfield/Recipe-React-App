import React, {Component} from 'react';
import './Status.css';
import {connect} from 'react-redux';
import * as actionCreators from '../../../store/reducers/index';
import {startTimer, addTask} from '../../../common/timer';
import Modal from '../../UI/Modal/Modal';
import Timeout from '../Timeout/Timeout';
import Auxiliary from '../../../hoc/Auxiliary';

class Status extends Component {

    constructor(props) {
        super(props);
        this.initialise();
    };

    initialise = () => {

        this.timerId1 = startTimer(1000);
        this.timerId2 = startTimer(25000);
    
        this.task1 = () => {
            this.props.onSetTime();
            if (this.props.AUT.sessionId !== null && (this.props.STT.running === undefined || !this.props.STT.running)) {
                if (this.isLogout()) {
                    this.props.onLogout();
                    this.props.onClearStatus();
                };
            };
        };
    
        this.task2 = () => {
            if (this.props.AUT.sessionId !== null && (this.props.STT.running === undefined || !this.props.STT.running)) {
                if (!this.isLogout()) {
                    this.props.onGetStatus();
                };
            };
        };
    
    //task2();
    
        this.taskId1 = addTask(this.timerId1, this.task1);
        this.taskId2 = addTask(this.timerId2, this.task2);

    }

    pad = (n, width, z) => {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    getDate = (date) => {
        let dt = new Date(date);
        return date === undefined || date === null ? "" : this.pad(dt.getHours(), 2) + ":" + this.pad(dt.getMinutes(), 2) + ":" + this.pad(dt.getSeconds(), 2);
    };

    getTime = (time) => {
        return time === undefined || time === null ? "" : (Math.floor(time / 60) + ":" + this.pad(time % 60, 2));
    };

    resetHandler = () => {
        this.props.onReset();
    };

    logoffHandler = () => {
        this.props.onLogout();
        this.props.onClearStatus();
    };

    closeHandler = () => {
    };

    isModalOpen = () => {
        return this.props.STT.data !== undefined && this.getTimeToExpire() >= 0 && this.getTimeToExpire() <= 60;
    };

    isLogout = () => {
        return this.props.STT.data !== undefined && this.getTimeToExpire() <= 0;
    };

    getTimeToExpire = () => {
        return  this.props.STT.data !== undefined ? Math.floor((new Date(this.props.STT.data.expiresAt) - this.props.STT.time) / 1000) : null;
    };

    render() {

        const modalStyles = {"backgroundColor": "lightgray", "height": "200px", "width": "600px", "border": "1px solid black"};
        const modal = (
            <Modal name="LOG" open={this.isModalOpen()} center closeHandler={this.closeHandler} modalstyles={modalStyles}>
                 <Timeout extensionHandler={this.resetHandler} logoffHandler={this.logoffHandler} timeToExpire={this.getTimeToExpire}/>
            </Modal>
        );

        const data = this.props.STT.data === undefined ? null : (
            <Auxiliary>
                <p>Last Used</p>
                <p>{this.getDate(this.props.STT.data.lastUsedAt)}</p>        
                <p>Time to Expire</p>          
                <p>{this.getTime(this.getTimeToExpire())}</p>
                <p>Expires</p>
                <p>{this.getDate(this.props.STT.data.expiresAt)}</p>   
            </Auxiliary>
        );

        return (
            <div className="status">
                {modal}
                <p>Time</p>
                <p>{this.getDate(this.props.STT.time)}</p>
                {data}
            </div>
        );  
    };

};

const mapStateToProps = state => {
    return {
        AUT: state.AUT,
        STT: state.STT
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetTime: () => dispatch(actionCreators.setCurrentTime()),
        onReset: () => dispatch(actionCreators.resetSession()),
        onGetStatus: () => dispatch(actionCreators.getSessionStatus()),
        onLogout: () => dispatch(actionCreators.logoff()),
        onClearStatus: () => dispatch(actionCreators.clearStatus())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Status);
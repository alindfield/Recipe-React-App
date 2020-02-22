import React from 'react';
import './Timeout.css';
import {connect} from 'react-redux';
import Buttons from '../../UI/Buttons/Buttons';

const timeout = (props) => {

    const pad = (n, width, z) => {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    const getTime = (time) => {
        return isNaN(time) || time === undefined || time === null ? "" : (Math.floor(time / 60) + ":" + pad(time % 60, 2));
    };

    const buttonsConfig = {
        extend: {
            label: 'Stay',
            clickHandler: props.extensionHandler
        },
        logoff: {
            label: 'Logoff',
            clickHandler: props.logoffHandler
        }
    };

    const detail = isNaN(props.timeToExpire()) || props.timeToExpire() === undefined || props.timeToExpire() === null ? '' : 'Your session will expire in ' + getTime(props.timeToExpire());

    return (
        <div className="timeout-timeout">
            <div className="timeout-headerpanel">
                <h2 className="timeout-header">Timeout</h2>
            </div>
            <div className="timeout-detailpanel">
                <p className="DetailText">{detail}</p>
            </div>
            <div className="timeout-buttonspanel">
                <Buttons config={buttonsConfig}/>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        STT: state.STT
    };
};

export default connect(mapStateToProps)(timeout);
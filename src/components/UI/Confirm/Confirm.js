import React from 'react';
import './Confirm.css';
import Panel from '../../UI/Panel/Panel';
import Buttons from '../Buttons/Buttons';

const confirm = (props) => {

    const confirmConfig = {
        confirm: {
            label: 'Confirm',
            clickHandler: props.deleteConfirmHandler
        }
    };

    const cancelConfig = {
        cancel: {
            label: 'Cancel',
            clickHandler: props.deleteCancelHandler
        }
    };

    return (
        <Panel title={props.title}>
            <br />
            <div className="confirm-row">
                <div className="confirm-left">
                    <Buttons config={confirmConfig}/>
                </div>
                <div className="confirm-right">
                    <Buttons config={cancelConfig}/>
                </div>
            </div>
        </Panel>
    );
};

export default confirm;
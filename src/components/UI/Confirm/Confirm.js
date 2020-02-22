import React from 'react';
import classes from './Confirm.css';
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
            <div className={classes.Row}>
                <div className={classes.Left}>
                    <Buttons config={confirmConfig}/>
                </div>
                <div className={classes.Right}>
                    <Buttons config={cancelConfig}/>
                </div>
            </div>
        </Panel>
    );
};

export default confirm;
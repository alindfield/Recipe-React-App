import React from 'react'
import classes from './SectionHeading.css';
import Buttons from '../UI/Buttons/Buttons';

const SectionHeading = (props) => {

    const config = {
        create: {
            label: 'Create',
            enabled: props.enabled,
            clickHandler: props.createHandler
        }
    };
//            
    return (
        <div className={classes.SectionHeading}>
<h2 className={classes.Heading}>{props.title}</h2>
<div className={classes.Buttons}>
            <Buttons config={config} /></div>
        </div>
    );
};

export default SectionHeading;
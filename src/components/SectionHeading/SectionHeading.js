import React from 'react'
import './SectionHeading.css';
import Buttons from '../UI/Buttons/Buttons';

const SectionHeading = (props) => {

    const config = {
        create: {
            label: 'Create',
            enabled: props.enabled,
            clickHandler: props.createHandler
        }
    };
       
    return (
        <div className="sectionheading">
            <h2 className="sectionheading-heading">{props.title}</h2>
            <div className="sectionheading-buttons">
            <Buttons config={config} /></div>
        </div>
    );
};

export default SectionHeading;
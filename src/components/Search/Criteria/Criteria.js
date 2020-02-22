import React from 'react';
import './Criteria.css';
import Form from '../../../containers/Form/Form';
import Buttons from '../../UI/Buttons/Buttons';

const criteria = (props) => {

    const formConfig = {
        title: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Enter title criteria'
            },
            value: props.data.title,
            label: 'Title',
            changeHandler: props.changeTitle
        },
        description: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Enter description criteria'
            },
            value: props.data.description,
            label: 'Description',
            changeHandler: props.changeDescription
        }
    }

    const buttonConfig = {
        search: {
            label: 'Search',
            clickHandler: props.submitClicked
        },
        clear: {
            label: 'Clear',
            clickHandler: props.clearClicked
        }
    }

    const buttonConfig2 = {
        create: {
            label: 'Create',
            clickHandler: props.createClicked
        }
    };
    
    return (
        <div className="criteria">
            <Form config={formConfig} data={props.data} labelWidth="80px" inputWidth="calc(100% - 80px)"/>
            <div className="criteria-buttons">
                <Buttons config={buttonConfig}/>
                <Buttons config={buttonConfig2}/>
            </div>
        </div>
    );
}

export default criteria;
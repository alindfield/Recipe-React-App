import React, {Component} from 'react';
import Form from './containers/Form/Form';

const items = [
    {key: '1', label: 'Chocolate'},
    {key: '2', label: 'Cocoa'},
    {key: '3', label: 'Cheese'},
    {key: '4', label: 'Artichoke'},
    {key: '5', label: 'Asparagus'},
    {key: '6', label: 'Banana'},
    {key: '7', label: 'Date'},
    {key: '8', label: 'Egg'},
    {key: '9', label: 'Eggplant'},
    {key: '10', label: 'Pineapple'},
    {key: '11', label: 'Pinenut'},
    {key: '12', label: 'Pork'},
    {key: '13', label: 'Peanut'},
    {key: '14', label: 'Peanut Butter'},
    {key: '15', label: 'Pot Noodle'},
    {key: '16', label: 'Paracetamol'},
    {key: '17', label: 'Pancetta'},
    {key: '18', label: 'Rocket'},
    {key: '19', label: 'Salmon'},
    {key: '20', label: 'Tangerine'}
];

const getConfig = (state, changeHandler, selectHandler) => {
    return {
        applicationRef: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
            },
            value: (state.data.applicationRef === undefined ? "" : state.data.applicationRef),
            label: 'Application Ref',
            changeHandler: changeHandler
        },
        sortCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
            },
            value: (state.data.sortCode === undefined ? "" : state.data.sortCode),
            label: 'Sort Code',
            changeHandler: changeHandler
        },
        accountNo: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
                readOnly: true
            },
            label: 'Account Number'
        },
        virNumber: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
                readOnly: true
            },
            label: 'VIR Number'
        },
        surname: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
                readOnly: true
            },
            label: 'Surname'
        },
        lookup: {
            elementType: 'list',
            elementConfig: {
                items: items,
                selectHandler: selectHandler,
                getId: (item) => {return item.key},
                getLabel: (item) => {return item.label}
            },
            label: 'Lookup'
        },
        forename: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
                readOnly: true
            },
            label: 'Forename'
        },
        postcode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
                readOnly: true
            },
            label: 'Post Code'
        },
        address1: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Optional',
                readOnly: true
            },
            label: 'Address Line 1'
        }     
    };
};

class Main extends Component {

    state = {
        data: {},
        selectedId: null,
        selectedValue: null
    };

    changeHandler = (id, value) => {
        const newData = {...this.state.data, [id]: value};
        this.setState({data: newData});
    };

    selectHandler = (selectedId, selectedValue) => {
        this.setState({selectedId: selectedId, selectedValue: selectedValue});
    };

    render() {
        const config = getConfig(this.state, this.changeHandler, this.selectHandler);
        return (
            <div>
                <Form config={config}/>
                <br />
                <h2>[{this.state.selectedId}]</h2>
                <h2>[{this.state.selectedValue}]</h2>
            </div>
        );
    };
};

export default Main;
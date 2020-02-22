import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input';
import {validateValue, validateForm} from '../../common/utilities';

class Form extends Component {

    state = {
        data: {},
        valid: false
    };
    
    changeHandler = (id, value) => {
        const data = {...this.state.data};
        const selectedData = {...data[id]};
        const rules = this.props.config[id].validation;
        [selectedData.valid, selectedData.reason] = validateValue(value, rules);
        selectedData.touched = true;
        data[id] = selectedData;
        const valid = validateForm(data, this.props.config);   
        if (this.props.notifyValid) this.props.notifyValid(valid);
        this.setState({data: data, valid: valid, validate: true});
        if (this.props.config[id].changeHandler !== undefined) {
            this.props.config[id].changeHandler(id, value);
        }
    };

    blurHandler = (id, value) => {
        const data = {...this.state.data};
        const selectedData = {...data[id]};
        const rules = this.props.config[id].validation;
        [selectedData.valid, selectedData.reason] = validateValue(value, rules);
        selectedData.touched = true;
        selectedData.active = false;
        data[id] = selectedData;
        this.setState({data: data});
    };

    checkForm = () => {
        let data = {};
        for(let id in this.props.config) {
            const rules = this.props.config[id].validation;
            const value = this.props.config[id].value;
            const [valid] = validateValue(value, rules);
            data = {...data, [id]: {valid: valid}};
        };
        for (let id in this.props.config.elementConfig) {
            const selectedData = {...data[id]};
            const rules = this.props.config[id].validation;
            [selectedData.valid, selectedData.reason] = validateValue(this.props.config[id].value, rules);            
            data[id] = selectedData;
        }
        const valid = validateForm(data, this.props.config);
        if (this.props.notifyValid) this.props.notifyValid(valid);
        this.setState({data: data, valid: valid, validate: false});
    };

    /*mouseEnterHandler = (id) => {
        const data = {...this.state.data};
        const selectedData = {...data[id]};
        selectedData.active = true;
        data[id] = selectedData;
        this.setState({data: data});
    };

    mouseLeaveHandler = (id) => {
        const data = {...this.state.data};
        const selectedData = {...data[id]};
        selectedData.active = false;
        data[id] = selectedData;
        this.setState({data: data});
    };*/

    componentDidMount () {
        this.checkForm();
    };

    reset = () => {
        this.checkForm();
    }
    //componentDidMount () {
        /*let newdata = {};
        for(let id in this.props.config) {
            const rules = this.props.config[id].validation;
            const value = this.props.config[id].value;
            const [valid] = validateValue(value, rules);
            newdata = {...newdata, [id]: {valid: valid}};
        };*/
    //   this.validateLoad();
    //}

    /*validateLoad = () => {
        const data = {...this.state.data};
        //const data = {...newdata};
        for (let id in this.props.config.elementConfig) {
            const selectedData = {...data[id]};
            const rules = this.props.config[id].validation;
            console.log(id, this.props.config[id].value);
            [selectedData.valid, selectedData.reason] = validateValue(this.props.config[id].value, rules);            
            data[id] = selectedData;
        }
        const valid = validateForm(data, this.props.config);
        if (this.props.notifyValid) this.props.notifyValid(valid);
        this.setState({data: data, valid: valid, validate: false});
    }*/


    render () {

        const forms = [];

        for (let key in this.props.config) {
            
            if (this.props.config[key].display === undefined || this.props.config[key].display) {
                forms.push({
                    id: key,
                    config: this.props.config[key]
                });
            }
        }

        return (
            <form>
                {forms.map((element) => {
                    return (
                        <Input
                            key={element.id}
                            id={element.id}
                            config={element.config}
                            data={this.state.data[element.id]}
                            changeHandler={this.changeHandler}
                            blurHandler={this.blurHandler}
                            labelWidth={element.config.labelWidth ? element.config.labelWidth : this.props.labelWidth}
                            inputWidth={element.config.inputWidth ? element.config.inputWidth : this.props.inputWidth}
                            updateRef={element.config.updateRef}
                        />
                    );
                })}
            </form>
        );

    };
};

export default Form;
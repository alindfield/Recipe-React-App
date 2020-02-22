import React, {PureComponent, cloneElement} from 'react';
import Modal from 'react-responsive-modal';
import {connect} from 'react-redux';
import * as actionCreators from '../../../store/reducers/index';

class ModalControl extends PureComponent {

    state = {
        open: false
    };

    componentDidUpdate(prevProps) {
        if (this.props.name !== undefined && this.props.open !== prevProps.open) {
            this.props.show(this.props.name, this.props.modalstyles.left, this.props.modalstyles.top);
        }
    };

    mouseDown = (_, name) => {
        if (name !== undefined) this.props.activate(name);
    };
    
    render() {
        const children = cloneElement(this.props.children, {mouseDown: (event) => this.mouseDown(event, this.props.name)});
        let styles = {...this.props.modalstyles};
        if (this.props.name !== undefined && this.props.POP.popups[this.props.name] !== undefined) {
            styles = {...styles, left: this.props.POP.popups[this.props.name].posX + "px", top: this.props.POP.popups[this.props.name].posY + "px"};
        };
        return (
            <div>
                <Modal open={this.props.open} onClose={this.props.closeHandler} styles={{modal: styles}} showCloseIcon={false} center={this.props.center}>
                    {children}
                </Modal>
            </div>            
        );
    };
};

const mapStateToProps = state => {
    return {
        POP: state.POP
    };
};

const mapDispatchToProps = dispatch => {
    return {
        activate: (name) => dispatch(actionCreators.activatePopup(name)),
        show: (name, posX, posY) => dispatch(actionCreators.openPopup(name, posX, posY))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalControl);
import React, {Component} from 'react';
import './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Sidebar from '../../components/Navigation/Sidebar/Sidebar';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/reducers/index';

class Layout extends Component {

    render() {

        const mouseUpHandler = () => {
            this.props.inactivate();
        }

        const mouseMoveHandler = (event) => {
            this.props.move(event.movementX, event.movementY);
        }

        return (
            <div onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler}>
                <Toolbar />
                <Sidebar />
                <main className="layout-container">
                    <div className="layout-content">
                        {this.props.children}
                    </div>
                </main>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        POP: state.POP
    };
};

const mapDispatchToProps = dispatch => {
    return {
        inactivate: () => dispatch(actionCreators.inactivatePopup()),
        move: (movementX, movementY) => dispatch(actionCreators.movePopup(movementX, movementY))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
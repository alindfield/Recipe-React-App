import React, {Component} from 'react';
import Criteria from '../../components/Search/Criteria/Criteria';
import Results from '../../components/Search/Results/Results';
import './Search.css';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/reducers/index';
import {Redirect} from 'react-router-dom';
import Error from '../../components/Error/Error';
import {setErrorAndDispatch} from '../../common/utilities';
import {Tab, TabItem} from '../../components/UI/Tab/Tab';
import datatypes from '../../common/datatypes';

class Search extends Component {

    research = () => {
        if (this.props.research) {
            this.props.search(this.props.title, this.props.description);
        }
    };

    componentDidMount() {
        this.research();
    }

    componentDidUpdate() {
        this.research();
    }

    changeTitle = (_, value) => {
        this.props.setCriteria(value.toUpperCase(), null);
    };

    changeDescription = (_, value) => {
        this.props.setCriteria(null, value.toUpperCase());
    };

    clearHandler = () => {
        this.props.clearIngredients();
        this.props.clearMethods();
        this.props.clear();
    };

    searchHandler = (event) => {
        event.preventDefault();
        this.props.search(this.props.SRC.title, this.props.SRC.description);
    };

    displayHandler = (id) => {
        this.props.clearMedia();
        this.props.getRecipe(id);
        this.props.getIngredients(id);
        this.props.getMethods(id);
    };

    createHandler = () => {
        this.props.clearMedia();
        this.props.clearIngredients();
        this.props.clearMethods();
        this.props.create();
    };

    render () {

        const tabs = [
            {id: 1, display: 'Search'}
        ];

        const tabline = tabs.map(tab => {
            return (
                <TabItem key={tab.id} id={tab.id} label={tab.display}/>
            );
        });

        let output = <Redirect to="/view"/>;
        
        if (this.props.recipe === null && !this.props.creating) {
            output = (
                <Error error={this.props.error}>
                    <div className="search">
                        <Tab selectedId={1}>
                            {tabline}
                        </Tab>
                        <div className="search-flex">
                            <Criteria 
                                changeDescription={this.changeDescription}
                                changeTitle={this.changeTitle}
                                data={this.props.SRC}
                                submitClicked={this.searchHandler}                           
                                clearClicked={this.clearHandler}
                                createClicked={this.createHandler}
                            />
                            <Results 
                                searching={this.props.searching}
                                recipes={this.props.recipes}
                                clicked={this.displayHandler}
                            />
                        </div>
                    </div>
                </Error>
            );
        };

        return output;

    };

}

const mapStateToProps = state => {
    return {
        SRC: state.SRC,
        title: state.SRC.title,
        description: state.SRC.description,
        recipes: state.SRC.recipes,
        searching: state.SRC.searching,
        recipe: state.RCP.recipe,
        creating: state.RCP.datatype === datatypes.INSERT,
        research: state.SRC.research,
        error: state.ERR
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCriteria: (title, description) => dispatch(actionCreators.setCriteria(title, description)),
        clear: () => setErrorAndDispatch(dispatch, actionCreators.clearSearch),
        search: (title, description) => dispatch(actionCreators.search(title, description)),
        getRecipe: (id) => dispatch(actionCreators.getRecipe(id)),
        getIngredients: (id) => dispatch(actionCreators.getIngredients(id)),
        getMethods: (id) => dispatch(actionCreators.getMethods(id)),
        create: () => setErrorAndDispatch(dispatch, actionCreators.createRecipe),
        clearMedia: () => dispatch(actionCreators.clearMedia()),
        clearMethods: () => dispatch(actionCreators.clearMethods()),
        clearIngredients: () => dispatch(actionCreators.clearIngredients())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
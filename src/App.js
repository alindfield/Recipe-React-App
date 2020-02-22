import React from 'react';
import Layout from './hoc/Layout/Layout';
import './App.css';
import Search from './containers/Search/Search';
import RecipeDetail from './components/Recipes/RecipeDetail/RecipeDetail';
import Authenticate from './containers/Authenticate/Authenticate';
import {Route, Switch, Redirect, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
//<Redirect to="/search/"/>
//<Redirect to="/login/"/>
function App(props) {
  
  const routes = props.isAuthenticated ? (
    <Switch>
      <Route exact path="/" component={Search} />
      <Route path="/search" component={Search} />
      <Route path="/view" component={RecipeDetail} />
      <Redirect to="/" />
   </Switch>
  ) : (
    <Switch>
      <Route exact path="/" component={Authenticate} />
      <Route path='/login' component={Authenticate} />
      <Redirect to="/" />
    </Switch>
  );

  return (
    <div className="app">
      <Layout>
        <HashRouter>
          <main>
            {routes}
          </main>
        </HashRouter>
      </Layout>
    </div>
  );
}

const mapStateToProps = state => {
  return {
      isAuthenticated: state.AUT.sessionId !== null
  };
};

export default connect(mapStateToProps)(App);
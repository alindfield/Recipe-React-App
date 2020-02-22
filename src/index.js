import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import searchReducer from './store/reducers/search';
import recipeReducer from './store/reducers/recipe';
import mediaReducer from './store/reducers/media';
import errorReducer from './store/reducers/error';
import authenticateReducer from './store/reducers/authenticate';
import ingredientReducer from './store/reducers/ingredient';
import methodReducer from './store/reducers/method';
import lookupReducer from './store/reducers/lookup';
import statusReducer from './store/reducers/status';
import popupReducer from './store/reducers/popup';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import '@atlaskit/css-reset';

const rootReducer = combineReducers({
    SRC: searchReducer,
    RCP: recipeReducer,
    MED: mediaReducer,
    ERR: errorReducer,
    AUT: authenticateReducer,
    ING: ingredientReducer,
    MTD: methodReducer,
    LKP: lookupReducer,
    STT: statusReducer,
    POP: popupReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

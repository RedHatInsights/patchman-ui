import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { init } from './store';
import getBaseName from './Utilities/getBaseName';

ReactDOM.render(
    <Provider store={init().getStore()}>
        <Router basename={getBaseName(window.location.pathname)}>
            <App />
        </Router>
    </Provider>,

    document.getElementById('root')
);

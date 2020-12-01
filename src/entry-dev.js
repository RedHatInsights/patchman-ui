import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { init } from './store';
import getBaseName from './Utilities/getBaseName';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';

ReactDOM.render(
    <IntlProvider locale = {navigator.language.slice(0, 2)}  messages={messages}>
        <Provider store={init().getStore()}>
            <Router basename={getBaseName(window.location.pathname)}>
                <App />
            </Router>
        </Provider>
    </IntlProvider>,

    document.getElementById('root')
);

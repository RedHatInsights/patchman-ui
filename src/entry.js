/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';

ReactDOM.render(
    <IntlProvider locale = {navigator.language.slice(0, 2)}  messages={messages} onError={console.log} >
        <Provider store={ init().getStore() }>
            <Router basename={ getBaseName(window.location.pathname) }>
                <App />
            </Router>
        </Provider>
    </IntlProvider>,
    document.getElementById('root')
);

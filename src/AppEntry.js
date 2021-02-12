import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { getStore } from './store';
import getBaseName from './Utilities/getBaseName';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';

const Patchman = () => (
    <IntlProvider locale = {navigator.language.slice(0, 2)}  messages={messages}>
        <Provider store={getStore()}>
            <Router basename={getBaseName(window.location.pathname)}>
                <App />
            </Router>
        </Provider>
    </IntlProvider>
);

export default Patchman;

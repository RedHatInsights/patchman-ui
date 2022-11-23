import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { store } from './store';
import getBaseName from './Utilities/getBaseName';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';

const Patchman = () => (<div className="patch-root">
    <IntlProvider locale={navigator.language.slice(0, 2)} messages={messages}>
        <Provider store={store}>
            <Router basename={getBaseName(window.location.pathname)}>
                <App style={{ overflow: 'clip', background: 'red', 'z-index': '1000' }} />
            </Router>
        </Provider>
    </IntlProvider>
</div>
);

export default Patchman;

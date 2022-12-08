import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';

import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';

const Patchman = () => (<div className="patch-root">
    <IntlProvider locale={navigator.language.slice(0, 2)} messages={messages}>
        <Provider store={store}>
            <App/>
        </Provider>
    </IntlProvider>
</div>
);

export default Patchman;

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
// import { getStore } from './store';
import getBaseName from './Utilities/getBaseName';
import { init, RegistryContext } from './store';
import logger from 'redux-logger';
import { EmptyState } from '@patternfly/react-core';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';

const Patchman = () => {
    const [registry, setRegistry] = useState();

    useEffect(() => {
        setRegistry(init(logger));

        return () => {
            setRegistry(undefined);
        };
    }, []);

    return (registry ? (
        <RegistryContext.Provider value={{
            getRegistry: () => registry
        }}>
            <IntlProvider locale={navigator.language.slice(0, 2)} messages={messages}>
                <Provider store={registry.getStore()}>
                    <Router basename={getBaseName(window.location.pathname)}>
                        <App style={{ overflow: 'clip', background: 'red', 'z-index': '1000' }} />
                    </Router>
                </Provider>
            </IntlProvider>
        </RegistryContext.Provider>
    ) : <EmptyState></EmptyState>);
};

export default Patchman;

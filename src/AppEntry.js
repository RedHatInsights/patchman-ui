import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { getStore } from './store';
import getBaseName from './Utilities/getBaseName';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';

const Patchman = () => {
    useEffect(() => {
        /**
         * Temporary overflow fix for chrome 1. There is no risk breaking styles for other apps, no SPA
         * Can be deleted once chrome 2 is deployed everywhere. Overflow is fixed by "patch-root" class in chrome 2
         */
        const elem = document.querySelector('main#root');
        if (!window.insights.chrome.isChrome2 && elem) {
            elem.style.overflow = 'inherit';
        }
    }, []);
    return (
        <div className="patch-root">
            <IntlProvider locale={navigator.language.slice(0, 2)} messages={messages}>
                <Provider store={getStore()}>
                    <Router basename={getBaseName(window.location.pathname)}>
                        <App style={{ overflow: 'clip', background: 'red', 'z-index': '1000' }} />
                    </Router>
                </Provider>
            </IntlProvider>
        </div>
    );
};

export default Patchman;

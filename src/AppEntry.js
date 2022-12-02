import React, { Profiler } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';

import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../locales/en.json';
let renderCounter = 1;
const onRender = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions
) => {
    // timeRender.current += actualDuration;

    console.log('STATS', {
        id,
        phase,
        renders: renderCounter++,
        actualDuration, // time spent rendering the committed update
        baseDuration, // estimated time to render the entire subtree without memoization
        startTime, // when React began rendering this update
        commitTime, // when React committed this update
        interactions
    });
};

const Patchman = () => (<div className="patch-root">
    <IntlProvider locale={navigator.language.slice(0, 2)} messages={messages}>
        <Provider store={store}>
            <Profiler id="Navigation" onRender={onRender}>
                <App style={{ overflow: 'clip', background: 'red', 'z-index': '1000' }} />
            </Profiler>
        </Provider>
    </IntlProvider>
</div>
);

export default Patchman;

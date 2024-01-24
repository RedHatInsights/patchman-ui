import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import Systems from './Systems';
import { render } from '@testing-library/react';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../../../locales/en.json';

initMocks();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('@redhat-cloud-services/frontend-components-utilities/helpers', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components-utilities/helpers'),
    downloadFile: jest.fn()
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    exportSystemsCSV: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    exportSystemsJSON: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchIDs: jest.fn(() => Promise.resolve({ success: true, data: ['test-system-id'] }).catch((err) => console.log(err))),
    fetchViewAdvisoriesSystems: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchApplicableSystemAdvisoriesApi: jest.fn(() => Promise.resolve({
        data: [{
            attributes: {
                advisory_type: 2,
                description: 'The tzdata penhancements.',
                public_date: '2020-10-19T15:02:38Z',
                synopsis: 'tzdata enhancement update'
            },
            id: 'RHBA-2020:4282',
            type: 'advisory'
        }]
    }).catch((err) => console.log(err))),
    fetchSystems: jest.fn(() => Promise.resolve({ success: true, data: ['test-system-id'] }).catch((err) => console.log(err))),
    getSystemsGroups: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)))
}));

jest.mock('../../Utilities/SystemsHelpers', () => ({
    ...jest.requireActual('../../Utilities/SystemsHelpers'),
    systemsColumnsMerger: jest.fn()
}));

jest.mock(
    '../../PresentationalComponents/Filters/OsVersionFilter'
);

const mockState = {
    entities: {
        rows: systemRows,
        metadata: {
            limit: 25,
            offset: 0,
            total_items: 10,
            has_systems: true
        },
        expandedRows: {},
        selectedRows: { 'test-system-id-1': true },
        error: {},
        total: systemRows.length,
        status: 'resolved'
    },
    GlobalFilterStore: {},
    SystemsStore: {
        queryParams: {}
    }
};
const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback(state);
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore(state);
};

let store = initStore(mockState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback(mockState);
    });
});

afterEach(() => {
    useSelector.mockClear();
});

describe('Systems.js', () => {
    it('should match the snapshot', () => {
        const { asFragment } = render(
            <IntlProvider locale={navigator.language.slice(0, 2)} messages={messages}>
                <Provider store={store}>
                    <Router><Systems /></Router>
                </Provider>
            </IntlProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

});

/* eslint-disable no-unused-vars */
import Advisories from './Advisories';
import { Provider, useSelector } from 'react-redux';
import { advisoryRows } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { storeListDefaults } from '../../Utilities/constants';
import { BrowserRouter as Router } from 'react-router-dom';
import {
    exportAdvisoriesCSV, exportAdvisoriesJSON, fetchIDs,
    fetchViewAdvisoriesSystems } from '../../Utilities/api';
import { act } from 'react-dom/test-utils';

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
    exportAdvisoriesJSON: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    exportAdvisoriesCSV: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchSystems: jest.fn(() => Promise.resolve({ data: { id: 'testId' } }).catch((err) => console.log(err))),
    fetchViewAdvisoriesSystems: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchIDs: jest.fn(() => Promise.resolve({ ids: [] }).catch((err) => console.log(err)))
}));

jest.mock('../../Utilities/constants', () => ({
    ...jest.requireActual('../../Utilities/constants'),
    publicDateOptions: jest.fn().mockReturnValue([]),
    advisorySeverities: [{
        value: 0,
        label: 'N/A',
        color: 'var(--pf-global--Color--200)'
    }]
}));
jest.mock('../Remediation/AsyncRemediationButton', () =>  () => <div></div>);

const mockState = { ...storeListDefaults,
    rows: advisoryRows,
    status: { isLoading: false, code: 200, hasError: false },
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 10
    }
};

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  AdvisoryListStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  AdvisoryListStore: state });
};

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ AdvisoryListStore: mockState });
    });
    wrapper = mount(<Provider store={store}>
        <Router><Advisories/></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('Advisories.js', () => {

    it('Should dispatch CHANGE_ADVISORY_LIST_PARAMS only once on load', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CHANGE_ADVISORY_LIST_PARAMS')).toHaveLength(1);
    });

    it('Should display error page when status is rejected', () => {
        const rejectedState = { ...mockState, status: 'rejected', error: { detail: 'test' } };
        useSelector.mockImplementation(callback => {
            return callback({ AdvisoryListStore: rejectedState });
        });
        const tempStore = initStore(rejectedState);
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><Advisories/></Router>
        </Provider>);
        expect(tempWrapper.find('Error')).toBeTruthy();
    });

    it('Should dispatch expandAdvisoryRow action onCollapse', () => {
        wrapper.find('TableView').props().onCollapse(null, 0, 'testValue');

        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'EXPAND_ADVISORY_ROW')).toHaveLength(1);
    });

    describe('test exports',  ()  => {

        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

        it('Should download csv file', () => {
            wrapper.find('TableView').props().onExport(null, 'csv');
            expect(exportAdvisoriesCSV).toHaveBeenCalledWith(
                {
                    page: 1,
                    page_size: 20
                },
                'advisories'
            );
        });

        it('Should download json file', () => {
            wrapper.find('TableView').props().onExport(null, 'json');
            expect(exportAdvisoriesJSON).toHaveBeenCalledWith(
                {
                    page: 1,
                    page_size: 20
                },
                'advisories'
            );
        });
    });

    it('should clear notifications store on unmount', async () => {
        let tempWrapper;
        try {
            await act(async () => {
                tempWrapper = mount(
                    <Provider store={store}>
                        <Router><Advisories /></Router>
                    </Provider>
                );
            });
        } catch { console.log('Advisories component failed to mount'); }

        act(() => {
            tempWrapper.unmount();
        });
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(
            item => item.type === '@@INSIGHTS-CORE/NOTIFICATIONS/CLEAR_NOTIFICATIONS')
        ).toHaveLength(1);
    });

    it('should fetch all the data using limit=-1', () => {
        const onSelect = wrapper.find('TableView').props().onSelect;
        try {
            onSelect('all');
        } catch {
            console.log('Advisories select failed');
        }

        expect(fetchIDs).toHaveBeenCalledWith(
            '/ids/advisories',
            { limit: -1, page: 1, page_size: 20 }
        );
    });

    it('should select rows', () => {
        const onSelect = wrapper.find('TableView').props().onSelect;
        onSelect('page');
        const dispatchedActions = store.getActions();
        expect(dispatchedActions[2].type).toEqual('SELECT_ADVISORY_ROW');
        expect(dispatchedActions[2].payload[0]).toEqual({
            id: 'RHEA-2020:2743',
            selected: 'RHEA-2020:2743'
        });
    });

    it('should handle remediation', async() => {
        const stateWithSelection = { ...mockState, selectedRows: { 'RHEA-2020:2743': true } };
        fetchViewAdvisoriesSystems.mockReturnValue(
            new Promise((resolve) => {
                resolve({ data: { testAdvisory: ['test-system'] } });
            })
        );
        useSelector.mockImplementation(callback => {
            return callback({ AdvisoryListStore: stateWithSelection });
        });

        const tempStore = initStore(stateWithSelection);
        const tempWrapper = mount(
            <Provider store={tempStore}>
                <Router>
                    <Advisories />
                </Router>
            </Provider>
        );
        const remediationProvider = tempWrapper.find('TableView').props().remediationProvider;
        const res = await remediationProvider(['RHEA-2020:2743'], () => {}, 'advisories');

        expect(res).toEqual({
            issues: [
                {
                    id: 'patch-advisory:testAdvisory',
                    description: 'testAdvisory',
                    systems: ['test-system']
                }
            ]
        });
    });
});


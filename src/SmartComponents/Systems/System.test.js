import { Provider, useSelector } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { exportSystemsCSV, exportSystemsJSON, fetchIDs } from '../../Utilities/api';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks, mountWithIntl } from '../../Utilities/unitTestingUtilities.js';
import Systems from './Systems';
import { render } from '@testing-library/react';
import UnassignSystemsModal from '../Modals/UnassignSystemsModal';
import NoRegisteredSystems from '../../PresentationalComponents/Snippets/NoRegisteredSystems';
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

jest.mock('../../Utilities/useFeatureFlag.js', () => jest.fn());

jest.mock('@unleash/proxy-client-react', () => ({
    ...jest.requireActual('@unleash/proxy-client-react'),
    useFlagsStatus: jest.fn(),
    useFlag: jest.fn()
}));

jest.mock('../../Utilities/useRemediationDataProvider', () => () => jest.fn());

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

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback(mockState);
    });
    wrapper = mountWithIntl(<Provider store={store}>
        <Router><Systems /></Router>
    </Provider>);
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

    it('Should dispatch CHANGE_SYSTEMS_PARAMS action once only', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CHANGE_SYSTEMS_PARAMS')).toHaveLength(1);
    });

    describe('test exports', () => {

        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

        it('Should download csv file', () => {
            const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
            exportConfig.onSelect(null, 'csv');
            expect(exportSystemsCSV).toHaveBeenCalledWith({}, 'systems');
        });

        it('Should download json file', () => {
            const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
            exportConfig.onSelect(null, 'json');
            expect(exportSystemsJSON).toHaveBeenCalledWith({}, 'systems');
        });
    });

    it('Should open remediation modal', () => {
        //NOTE Should be refactored.
        /* const { tableProps: { actionResolver } } = wrapper.find('.testInventroyComponentChild').parent().props();
        const actions = actionResolver(systemRows[0]);
        expect(actions[0]).toMatchSnapshot(); */
    });

    it('Should display ErrorMessage component when status="rejected"', () => {
        const notFoundState = {
            ...mockState,
            status: 'rejected',
            error: {
                status: 403,
                title: 'testTitle',
                detail: 'testDescription'
            }
        };

        useSelector.mockImplementation(callback => {
            return callback({
                SystemsListStore: notFoundState,
                GlobalFilterStore: {},
                entities: { columns: [{ id: 'entity' }] }
            });
        });

        const tempStore = initStore(notFoundState);
        const tempWrapper = mountWithIntl(<Provider store={tempStore}>
            <Router><Systems /></Router>
        </Provider>);

        expect(tempWrapper.find('EmptyState')).toBeTruthy();
    });

    it('Should display NoRegisteredSystems compnent if there are no systems registered', () => {
        const notFoundState = {
            ...mockState,
            status: 'rejected',
            error: {
                status: 403,
                title: 'testTitle',
                detail: 'testDescription'
            }
        };

        useSelector.mockImplementation(callback => {
            return callback({
                ...mockState,
                GlobalFilterStore: {},
                entities: {
                    ...mockState.entities,
                    metadata: { has_systems: false }
                }
            });
        });

        const tempStore = initStore(notFoundState);
        const tempWrapper = mountWithIntl(<Provider store={tempStore}>
            <Router><Systems /></Router>
        </Provider>);

        expect(tempWrapper.find(NoRegisteredSystems)).toBeTruthy();
    });

    describe('test patch-set: ', () => {
        describe('Unassign systems from patch templates', () => {

            it('should table row actions open UnassignSystemsModal with row id', async () => {
                const tempWrapper = mountWithIntl(<Provider store={store}>
                    <Router><Systems /></Router>
                </Provider>);

                const { tableProps: { actionResolver } } = tempWrapper.find('.testInventroyComponentChild').parent().props();
                const actions = actionResolver(systemRows[0]);

                await act(async () => actions[2].onClick(undefined, undefined, { id: 'test-id' }));

                tempWrapper.update();

                expect(tempWrapper.find(UnassignSystemsModal).props().unassignSystemsModalState)
                .toEqual({ isUnassignSystemsModalOpen: true, systemsIDs: ['test-id'], shouldRefresh: false });
            });

            it('should table toolbar button open UnassignSystemsModal with selected system IDs', () => {
                const tempWrapper = mountWithIntl(<Provider store={store}>
                    <Router><Systems /></Router>
                </Provider>);

                const { actionsConfig } = tempWrapper.find('.testInventroyComponentChild').parent().props();
                act(() => actionsConfig.actions[2].onClick());

                tempWrapper.update();

                expect(tempWrapper.find(UnassignSystemsModal).props().unassignSystemsModalState)
                .toEqual({ isUnassignSystemsModalOpen: true, systemsIDs: ['test-system-id-1'], shouldRefresh: false });
            });
        });

    });

    describe('test entity selecting', () => {
        it('Should unselect all', () => {
            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[0].onClick();
            const dispatchedActions = store.getActions();

            expect(dispatchedActions[1].type).toEqual('SELECT_ENTITY');
            expect(dispatchedActions[1].payload).toEqual([{ id: 'test-system-id-1', selected: false }]);
            expect(bulkSelect.items[0].title).toEqual('Select none (0)');
        });

        it('Should select a page', async () => {

            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[1].onClick();
            const dispatchedActions = store.getActions();

            expect(dispatchedActions[1].payload).toEqual([
                { id: 'test-system-id-1', selected: 'test-system-id-1' },
                { id: 'test-system-id-2', selected: 'test-system-id-2' }
            ]);
            expect(dispatchedActions[1].type).toEqual('SELECT_ENTITY');
            expect(bulkSelect.items[1].title).toEqual('Select page (2)');
        });

        it('Should select all with limit=-1', async () => {

            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[2].onClick();

            expect(fetchIDs).toHaveBeenCalledWith('/ids/systems', { limit: -1, offset: 0 });
            expect(bulkSelect.items[2].title).toEqual('Select all (2)');
        });

        it('Should select all filtered systems', async () => {
            const testState = {
                ...mockState,
                entities: { ...mockState.entities, rows: systemRows[0], total: 1 },
                SystemsStore: { queryParams: { search: 'test-system-1' } }
            };

            useSelector.mockImplementation(callback => {
                return callback(testState);
            });

            const tempStore = initStore(testState);
            const tempWrapper = mountWithIntl(<Provider store={tempStore}>
                <Router><Systems /></Router>
            </Provider>);

            const { bulkSelect } = tempWrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[2].onClick();

            expect(fetchIDs).toHaveBeenCalledWith(
                '/ids/systems',
                { limit: -1, search: 'test-system-1', offset: 0 }
            );
            expect(bulkSelect.items[2].title).toEqual('Select all (1)');
        });
    });

});

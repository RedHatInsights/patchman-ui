import { act } from 'react-dom/test-utils';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { exportSystemsCSV, exportSystemsJSON } from '../../Utilities/api';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import Systems from './Systems';

/* eslint-disable */
initMocks()


jest.mock('../../store', () => ({
    ...jest.requireActual('../../store'),
    getStore: jest.fn(()=>({
        getState: () => ({ SystemsListStore: { rows: [] }})
    })),
    register: jest.fn()
}));

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
    fetchApplicableSystemAdvisoriesApi: jest.fn(() => Promise.resolve({ data: [{ 
        attributes: {
            advisory_type: 2,
            description: "The tzdata penhancements.",
            public_date: "2020-10-19T15:02:38Z",
            synopsis: "tzdata enhancement update"
        },
        id: "RHBA-2020:4282",
        type: "advisory"}] }).catch((err) => console.log(err))), 
}));

const mockState = { 
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 10
    },
    expandedRows: {},
    selectedRows: { 'RHSA-2020:2774': true },
    queryParams: {},
    error: {},
    status: 'resolved', 
    rows:  systemRows 
};

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  SystemsListStore: state });
        });
        next(action);
    };
    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  SystemsListStore: state });
}

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => {};
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ SystemsListStore: mockState });
    });
    wrapper = mount(<Provider store={store}>
            <Router><Systems /></Router>
        </Provider>); 
});

afterEach(() => {
    useSelector.mockClear();
});

describe('Systems.js', () => {

    it('Should dispatch FETCH_SYSTEMS action once only', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'FETCH_SYSTEMS')).toHaveLength(1);
    });

    it('Should handle inventory and filter refresh', () => {
        const { onRefresh } = wrapper.update().find('InventoryTable').props();
        onRefresh({ page: 1, per_page: 10 });

        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CHANGE_SYSTEMS_LIST_PARAMS')).toHaveLength(1);
        expect(dispatchedActions[1].payload).toEqual({ limit: 10 });
    });

    describe('test exports',  ()  => {

        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

        it('Should download csv file', () => {
            const { exportConfig } = wrapper.update().find('InventoryTable').props();
            exportConfig.onSelect(null, 'csv');
            expect(exportSystemsCSV).toHaveBeenCalledWith({});
        });

        it('Should download json file', () => {
            const { exportConfig } = wrapper.update().find('InventoryTable').props();
            exportConfig.onSelect(null, 'json');
            expect(exportSystemsJSON).toHaveBeenCalledWith({});
        });
    });

    it('Should open remediation modal', () => {

        const { actions } = wrapper.update().find('InventoryTable').props();
        act(() => actions[0].onClick(null, null, {
                id: "patch-advisory:RHBA-2020:4282"
        }));
        expect(wrapper.update().find('RemediationModal')).toBeTruthy();
    });

    it('Should test if actions are disabled', () => {

        const { tableProps } = wrapper.update().find('InventoryTable').props();
        const isDisabled = tableProps.areActionsDisabled({ applicable_advisories: [0,0,0]});
        expect(isDisabled).toBeTruthy();
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
                entities: { columns: [{ id: 'entity' }] }
            });
        });
        
        const tempStore = initStore(notFoundState);
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><Systems/></Router>
        </Provider>);

        expect(tempWrapper.find('EmptyState')).toBeTruthy();
    });
});
/* eslint-enable */

import SystemAdvisories from './SystemAdvisories';
import { Provider } from 'react-redux';
import { systemAdvisoryRows } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { remediationProvider } from '../../Utilities/Helpers';
import { remediationIdentifiers } from '../../Utilities/constants';
/* eslint-disable */
initMocks()


jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('../../Utilities/Helpers', () => ({
    ...jest.requireActual('../../Utilities/Helpers'),
    remediationProvider: jest.fn()
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchApplicableSystemAdvisoriesApi: jest.fn()
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
    status: {}, 
    rows:  systemAdvisoryRows 
};


const initStore = (state) => {
    const customMiddleWare = store => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  SystemAdvisoryListStore: state, entityDetails: { entity: { id: 'test' }} });
        });
        next(action);
    };
    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  SystemAdvisoryListStore: state, entityDetails: { entity: { id: 'test' }} });
}

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ SystemAdvisoryListStore: mockState, entityDetails: { entity: { id: 'test' } } });
    });
    wrapper = mount(<Provider store={store}>
            <Router><SystemAdvisories/></Router>
        </Provider>); 
});

afterEach(() => {
    useSelector.mockClear();
});

describe('SystemAdvisories.js', () => {

    it('Should dispatch CHANGE_ADVISORY_LIST_PARAMS only once on load', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CHANGE_SYSTEM_SYSTEMS_LIST_PARAMS')).toHaveLength(1);       
    });

    it('Should dispatch expandAdvisoryRow action onCollapse', () => {
        wrapper.find('TableView').props().onCollapse(null, 0, 'testValue');

        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'EXPAND_SYSTEM_ADVISORY_ROW')).toHaveLength(1);
        expect(dispatchedActions[1].payload).toEqual({
            rowId: 'RHSA-2020:2774', 
            value: 'testValue'
        });       
    });

    it('Should collapse a row ', () => {
        wrapper.find('TableView').props().onCollapse(null, 0, 'testValue');

        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'EXPAND_SYSTEM_ADVISORY_ROW')).toHaveLength(1);
        expect(dispatchedActions[1].payload).toEqual({
            rowId: 'RHSA-2020:2774', 
            value: 'testValue'
        });       
    });

    it('Should provide correct remediation data', () => {
        const remediation = wrapper.find('TableView').props().remediationProvider;
        remediation();
        expect(remediationProvider).toHaveBeenCalledWith([true], 'test', remediationIdentifiers.advisory);
    });

    describe('test entity selecting', () => {
        it('Should unselect all', () => {
            const { bulkSelect } = wrapper.find('PrimaryToolbar').props();
            
            bulkSelect.items[0].onClick();
            const dispatchedActions = store.getActions();
            expect(dispatchedActions[1].type).toEqual('SELECT_SYSTEM_ADVISORY_ROW');
            expect(bulkSelect.items[0].title).toEqual('Select none (0)');
        });

        it('Should select a page', () => {

            const { bulkSelect } = wrapper.find('PrimaryToolbar').props();

            bulkSelect.items[1].onClick();
            const dispatchedActions = store.getActions();
            expect(dispatchedActions[1].type).toEqual('SELECT_SYSTEM_ADVISORY_ROW');
            expect(bulkSelect.items[1].title).toEqual('Select page (1)');            
        });

        it('Should select all', () => {
            fetchApplicableSystemAdvisoriesApi.mockReturnValue(new Promise((resolve, reject) =>  {
                resolve({ data: systemAdvisoryRows });
            }));

            const { bulkSelect } = wrapper.find('PrimaryToolbar').props();

            bulkSelect.items[2].onClick();
            expect(fetchApplicableSystemAdvisoriesApi).toHaveBeenCalled();
            expect(bulkSelect.items[2].title).toEqual('Select all (10)');            
        });

        it('Should select a single entity', () => {
            const { onSelect } = wrapper.find('TableView').props();

            onSelect('single', 'test', 0);
            const dispatchedActions = store.getActions();
            expect(dispatchedActions[1].type).toEqual('SELECT_SYSTEM_ADVISORY_ROW');
            expect(dispatchedActions[1].payload).toEqual([{ id: 'RHSA-2020:2774', selected: 'RHSA-2020:2774' }]);          
        });

        it('Should handle onSelect', () => {
            fetchApplicableSystemAdvisoriesApi.mockReturnValue(new Promise((resolve, reject) =>  {
                resolve({ data: systemAdvisoryRows });
            }));

            const { bulkSelect } = wrapper.find('PrimaryToolbar').props();

            bulkSelect.onSelect();
            const dispatchedActions = store.getActions();
            expect(dispatchedActions[1].type).toEqual('SELECT_SYSTEM_ADVISORY_ROW');            
            expect(dispatchedActions[1].payload).toEqual([
                    {
                        id: 'RHSA-2020:2774',
                        selected: false,
                    }
                ]
            );            
        });
    });
        
    it('Should display SystemUpToDate when status is resolved, but there is no items', () => {
        const emptyState = {
            ...mockState,  
            metadata: { 
                limit: 25,
                offset: 0,
                total_items: 10,
                search: 'test',
                filter: {}
            }
        };

        useSelector.mockImplementation(callback => {
            return callback({ SystemAdvisoryListStore: emptyState, entityDetails: { entity: 'test' } });
        });
        
        const tempStore = initStore(mockState);
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><SystemAdvisories/></Router>
        </Provider>);

        expect(tempWrapper.find('SystemUpToDate')).toBeTruthy();
    });
});
/* eslint-enable */

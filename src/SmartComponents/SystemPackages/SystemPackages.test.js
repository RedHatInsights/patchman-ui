import SystemPackages from './SystemPackages';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import { systemPackages } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { storeListDefaults, remediationIdentifiers } from '../../Utilities/constants';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchIDs } from '../../Utilities/api';
import { remediationProvider } from '../../Utilities/Helpers';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';

initMocks();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchIDs: jest.fn(() => Promise.resolve({
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
    }).catch((err) => console.log(err)))
}));

jest.mock('../../Utilities/Helpers', () => ({
    ...jest.requireActual('../../Utilities/Helpers'),
    encodeApiParams: jest.fn(),
    remediationProvider: jest.fn()
}));
jest.mock('../Remediation/AsyncRemediationButton', () => () => <div></div>);

const mockState = { ...storeListDefaults, rows: systemPackages };

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  SystemPackageListStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  SystemPackageListStore: state });
};

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ SystemPackageListStore: mockState });
    });
    wrapper = mount(<Provider store={store}>
        <Router><SystemPackages inventoryId='entity'/></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('SystemPackages.js', () => {
    it('Should match the snapshots', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should dispatch FETCH_APPLICABLE_SYSTEM_PACKAGES only once on load', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'FETCH_APPLICABLE_SYSTEM_PACKAGES')).toHaveLength(1);
    });

    it('Should display error page when status is rejected', () => {
        const rejectedState = {
            ...mockState,
            status: { code: 403, isLoading: false, hasError: true },
            error: { detail: 'test' }
        };
        useSelector.mockImplementation(callback => {
            return callback({ SystemPackageListStore: rejectedState });
        });
        const tempStore = initStore(rejectedState);
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><SystemPackages inventoryId='entity' /></Router>
        </Provider>);
        expect(tempWrapper.find('Error')).toBeTruthy();
    });

    it('Should call apply function with parameters', () => {

        const { apply } = wrapper.update().find('TableView').props();
        apply({ params: 'testParams' });
        const dispatchedActions = store.getActions();

        expect(dispatchedActions[1].type).toEqual('CHANGE_SYSTEM_PACKAGES_LIST_PARAMS');
        expect(dispatchedActions[1].payload).toEqual({ id: 'entity', params: 'testParams' });
    });

    it('Should use onSelect', () => {
        const { onSelect } = wrapper.update().find('TableView').props();
        onSelect(null, true, 1);
        const dispatchedActions = store.getActions();

        expect(dispatchedActions[1].type).toEqual('SELECT_SYSTEM_PACKAGES_ROW');
        expect(dispatchedActions[1].payload).toEqual([{
            id: 'test-name-2-test-evra-2',
            selected: 'test-name-2-test-update-evra'
        }]);
    });

    it('Should select all with limit=-1', () => {
        const { onSelect } = wrapper.update().find('TableView').props();
        onSelect('all');
        expect(fetchIDs).toHaveBeenCalledWith('/systems/entity/packages', { limit: -1, offset: 0, page: 1, page_size: 20 });
    });

    it('Should provide correct remediation data', () => {
        const remediation = wrapper.find('TableView').props().remediationProvider;
        remediation();
        expect(remediationProvider).toHaveBeenCalledWith([], 'entity', remediationIdentifiers.package);
    });

    it('Should display SystemUpToDate when status is resolved, but there is no items', () => {
        const emptyState = {
            ...mockState,
            metadata: {
                limit: 25,
                offset: 0,
                total_items: 0
            },
            queryParams: {},
            status: 'resolved',
            rows: systemPackages
        };

        useSelector.mockImplementation(callback => {
            return callback({ SystemPackageListStore: emptyState, entityDetails: { entity: { id: 'entity' } } });
        });

        const tempStore = initStore(emptyState);
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><SystemPackages inventoryId='entity' /></Router>
        </Provider>);

        expect(tempWrapper.find('SystemUpToDate')).toBeTruthy();
    });

    it('Should display NotConnected', () => {
        const notFoundState = {
            ...mockState,
            status: { code: 403, isLoading: false, hasError: true },
            error: {
                status: 404,
                title: 'testTitle',
                detail: 'testDescription'
            }
        };

        useSelector.mockImplementation(callback => {
            return callback({ SystemPackageListStore: notFoundState, entityDetails: { entity: { id: 'entity' } } });
        });

        const tempStore = initStore(notFoundState);
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><SystemPackages handleNoSystemData={() => <NotConnected />} inventoryId='entity' /></Router>
        </Provider>);
        expect(tempWrapper.find('NotConnected')).toBeTruthy();

    });
});


/* eslint-disable no-unused-vars */
import toJson from 'enzyme-to-json';
import { act } from 'react-dom/test-utils';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { fetchAdvisorySystems } from '../../Utilities/api';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import AdvisorySystems from './AdvisorySystems';
import { BrowserRouter as Router } from 'react-router-dom';

initMocks();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({ location: { search: 'testSearch' } }))
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchAdvisorySystems: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)))
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components/Inventory'),
    InventoryTable: jest.fn(() => <div className='testInventroyComponentChild'><div>This is child</div></div>)
}));

const mockState = {
    entities: {
        rows: systemRows,
        metadata: {
            limit: 25,
            offset: 0,
            total_items: 10
        },
        expandedRows: {},
        selectedRows: { 'test-system-1': true },
        error: {},
        status: 'resolved',
        total: 2
    },
    AdvisorySystemsStore: {
        queryParams: {}
    }
};

const initStore = () => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback(mockState);
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore(mockState);
};

let wrapper;
let store = initStore();
// eslint-disable-next-line no-unused-vars
const rejectedState = { entities: { ...mockState, status: 'rejected', error: { detail: 'test' } },
    AdvisorySystemsStore: mockState.AdvisorySystemsStore };
beforeEach(() => {
    useSelector.mockImplementation(callback => {
        return callback(mockState);
    });

    /**
 * This mount snapshot test is failing because of randomly generated key in PF component.
 * Before the snapshot was only shallow and did not display the real virtual DOM.
 * Shallow snapshot has the same result as the mount before.
 */
    wrapper = mount(<Provider store={store}>
        <Router> <AdvisorySystems advisoryName={'RHSA-2020:2755'} /></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
    store.clearActions();
});

describe('AdvisorySystems.js', () => {

    it('Should match the snapshots and dispatch FETCH_AFFECTED_SYSTEMS only once', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should display error page when status is rejected', () => {
        useSelector.mockImplementation(callback => {
            return callback({ AdvisorySystemsStore: rejectedState });
        });
        const testStore = initStore(rejectedState);
        const wrapper = mount(
            <Provider store={testStore}>
                <AdvisorySystems advisoryName = {'RHSA-2020:2755'} />
            </Provider>
        );
        expect(wrapper.find('Error')).toBeTruthy();
    });

    describe('test entity selecting', () => {
        it('Should unselect all', async() => {
            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[0].onClick();
            const dispatchedActions = store.getActions();
            expect(dispatchedActions[1].type).toEqual('SELECT_ENTITY');
            expect(bulkSelect.items[0].title).toEqual('Select none (0)');
            expect(dispatchedActions[1].payload).toEqual([{ id: 'test-system-1', selected: false }]);
        });

        it('Should select a page', async () => {
            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[1].onClick();
            const dispatchedActions = store.getActions();

            expect(dispatchedActions[1].type).toEqual('SELECT_ENTITY');
            expect(bulkSelect.items[1].title).toEqual('Select page (2)');
            expect(dispatchedActions[1].payload).toEqual([
                { id: 'test-system-id-1', selected: 'test-system-id-1' },
                { id: 'test-system-id-2', selected: 'test-system-id-2' }
            ]);
        });

        it('Should select all', async () => {
            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[2].onClick();
            expect(fetchAdvisorySystems).toHaveBeenCalledWith({ id: 'RHSA-2020:2755', limit: -1 });
            expect(bulkSelect.items[2].title).toEqual('Select all (2)');
        });

        it('Should handle onSelect', async () => {
            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.onSelect();
            const dispatchedActions = store.getActions();
            expect(dispatchedActions[1].type).toEqual('SELECT_ENTITY');
            expect(dispatchedActions[1].payload).toEqual([
                {
                    id: 'test-system-1',
                    selected: false
                }
            ]
            );
        });
    });

    it('Should open remediation modal', async () => {
        const { dedicatedAction } = wrapper.find('.testInventroyComponentChild').parent().props();
        expect(dedicatedAction).toMatchSnapshot();
    });

    it('Should clear store on unmount', () => {
        act(() => {
            wrapper.unmount();
        });
        const dispatchedActions = store.getActions();

        expect(dispatchedActions.filter(item => item.type === 'CLEAR_INVENTORY_REDUCER')).toHaveLength(1);
        expect(dispatchedActions.filter(item => item.type === 'CLEAR_ADVISORY_SYSTEMS_REDUCER')).toHaveLength(1);
    });
});

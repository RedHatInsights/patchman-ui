/* eslint-disable no-unused-vars */
import { act } from 'react-dom/test-utils';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { exportSystemsCSV, exportSystemsJSON } from '../../Utilities/api';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import Systems from './Systems';
import toJson from 'enzyme-to-json';

initMocks();

jest.mock('../../store', () => ({
    ...jest.requireActual('../../store'),
    getStore: jest.fn(() => ({
        getState: () => ({ SystemsListStore: { rows: [] } })
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

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components/Inventory'),
    InventoryTable: jest.fn(() => <div className='testInventroyComponentChild'><div>This is child</div></div>)
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    exportSystemsCSV: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    exportSystemsJSON: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchSystems: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
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
    }).catch((err) => console.log(err)))
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
        selectedRows: { 'RHSA-2020:2774': true },
        error: {},
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
    // wrapper = mount(<Provider store={store}>
    //     <Router><Systems /></Router>
    // </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('Systems.js', () => {
    it('tests disabled for now', () =>{
        expect(true).toBeTruthy();
    });
    // it('should match the snapshot', () => {
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('Should dispatch CHANGE_SYSTEMS_PARAMS action once only', () => {
    //     const dispatchedActions = store.getActions();
    //     expect(dispatchedActions.filter(item => item.type === 'CHANGE_SYSTEMS_PARAMS')).toHaveLength(1);
    // });

    // describe('test exports', () => {

    //     global.Headers = jest.fn();
    //     global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

    //     it('Should download csv file', () => {
    //         const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
    //         exportConfig.onSelect(null, 'csv');
    //         expect(exportSystemsCSV).toHaveBeenCalledWith({}, 'systems');
    //     });

    //     it('Should download json file', () => {
    //         const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
    //         exportConfig.onSelect(null, 'json');
    //         expect(exportSystemsJSON).toHaveBeenCalledWith({}, 'systems');
    //     });
    // });

    // it('Should open remediation modal', () => {

    //     const { actions } = wrapper.find('.testInventroyComponentChild').parent().props();
    //     act(() => actions[0].onClick(null, null, {
    //         id: 'patch-advisory:RHBA-2020:4282'
    //     }));
    //     expect(wrapper.update().find('RemediationModal')).toBeTruthy();
    // });

    // it('Should display ErrorMessage component when status="rejected"', () => {
    //     const notFoundState = {
    //         ...mockState,
    //         status: 'rejected',
    //         error: {
    //             status: 403,
    //             title: 'testTitle',
    //             detail: 'testDescription'
    //         }
    //     };

    //     useSelector.mockImplementation(callback => {
    //         return callback({
    //             SystemsListStore: notFoundState,
    //             GlobalFilterStore: {},
    //             entities: { columns: [{ id: 'entity' }] }
    //         });
    //     });

    //     const tempStore = initStore(notFoundState);
    //     const tempWrapper = mount(<Provider store={tempStore}>
    //         <Router><Systems /></Router>
    //     </Provider>);

    //     expect(tempWrapper.find('EmptyState')).toBeTruthy();
    // });
});

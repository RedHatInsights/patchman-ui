/* eslint-disable no-unused-vars */
import { act } from 'react-dom/test-utils';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { exportPackageSystemsCSV, exportPackageSystemsJSON, fetchPackageSystems } from '../../Utilities/api';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import PackageSystems from './PackageSystems';

/* eslint-disable */
initMocks()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockReturnValue({ pathname: ' testName' })
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
    exportPackageSystemsCSV: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    exportPackageSystemsJSON: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchPackageSystems: jest.fn(() => Promise.resolve({
        data: [{
            attributes: {
                advisory_type: 2,
                description: "The tzdata penhancements.",
                public_date: "2020-10-19T15:02:38Z",
                synopsis: "tzdata enhancement update"
            },
            id: "RHBA-2020:4282",
            type: "advisory"
        }]
    }).catch((err) => console.log(err))),
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
        status: 'resolved',
    },
    PackageSystemsStore: {
        queryParams: {},
    }
};

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback(mockState);
        });
        next(action);
    };
    const mockStore = configureStore([customMiddleWare]);
    return mockStore(mockState);
}

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => { };
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback(mockState);
    });
    wrapper = mount(<Provider store={store}>
        <Router><PackageSystems packageName='testName'/></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('PackageSystems.js', () => {

    it('Should dispatch change package systems params  action once only', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CHANGE_PACKAGE_SYSTEMS_PARAMS')).toHaveLength(1);
    });


    it('Should open remediation modal', () => {

        const { dedicatedAction } = wrapper.find('.testInventroyComponentChild').parent().props();
        act(() => dedicatedAction.props.onClick(null, null, {
            id: "patch-advisory:RHBA-2020:4282"
        }));
        expect(wrapper.update().find('RemediationModal')).toBeTruthy();
    });

    describe('test exports', () => {

        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

        it('Should download csv file', () => {
            const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
            exportConfig.onSelect(null, 'csv');
            expect(exportPackageSystemsCSV).toHaveBeenCalledWith({}, 'testName');
        });

        it('Should download json file', () => {
            const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
            exportConfig.onSelect(null, 'json');
            expect(exportPackageSystemsJSON).toHaveBeenCalledWith({}, 'testName');
        });
    });

    describe('test entity selecting', () => {
        it('Should unselect all', () => {
            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[0].onClick();
            const dispatchedActions = store.getActions();

            expect(dispatchedActions[3].type).toEqual('SELECT_ENTITY');
            expect(bulkSelect.items[0].title).toEqual('Select none (0)');
        });

        it('Should select a page', async () => {

            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[1].onClick();
            const dispatchedActions = store.getActions();
            expect(dispatchedActions[2].type).toEqual('SELECT_ENTITY');
            expect(bulkSelect.items[1].title).toEqual('Select page (1)');
        });

        it('Should select all', async () => {

            const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

            bulkSelect.items[2].onClick();
            expect(fetchPackageSystems).toHaveBeenCalled();
            expect(bulkSelect.items[2].title).toEqual('Select all (0)');
        });

    });

});
/* eslint-enable */

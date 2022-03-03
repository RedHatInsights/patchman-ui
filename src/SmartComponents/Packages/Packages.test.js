import Packages from './Packages';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import { storeListDefaults } from '../../Utilities/constants';
import { BrowserRouter as Router } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import { systemPackages } from '../../Utilities/RawDataForTesting';
import { exportPackagesJSON, exportPackagesCSV } from '../../Utilities/api';

initMocks();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn().mockReturnValue({ pathname: ' testName', location: { search: 'testSearch' }, push: () => {} })
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    exportPackagesCSV: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    exportPackagesJSON: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchPackagesList: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)))
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

const mockState = {
    ...storeListDefaults,
    rows: systemPackages,
    status: { isLoading: false, code: 200, hasError: false }
};

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ PackagesListStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ PackagesListStore: state });
};

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => { };

    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ PackagesListStore: mockState });
    });
    wrapper = mount(<Provider store={store}>
        <Router><Packages /></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('Packages.js', () => {
    it('should match the snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should fetch packages only once on load', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CHANGE_PACKAGES_LIST_PARAMS')).toHaveLength(1);
        expect(dispatchedActions.filter(item => item.type === 'FETCH_PACKAGES_LIST')).toHaveLength(1);
    });

    describe('test exports', () => {

        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

        it('Should download csv file', () => {
            wrapper.find('TableView').props().onExport(null, 'json');
            expect(exportPackagesJSON).toHaveBeenCalledWith({ page: 1, page_size: 20 }, 'packages');
        });

        it('Should download json file', () => {
            wrapper.find('TableView').props().onExport(null, 'csv');

            expect(exportPackagesCSV).toHaveBeenCalledWith({ page: 1, page_size: 20 }, 'packages');
        });
    });
});

import Packages from './Packages';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import { storeListDefaults } from '../../Utilities/constants';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { systemPackages } from '../../Utilities/RawDataForTesting';
import { exportPackagesJSON, exportPackagesCSV } from '../../Utilities/api';
import { queryByText, queryAllByText } from '@testing-library/dom';
import { ComponentWithContext, testExport } from '../../Utilities/TestingUtilities';
import '@testing-library/jest-dom';

initMocks();

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    exportPackagesCSV: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    exportPackagesJSON: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchPackagesList: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)))
}));

const mockState = {
    ...storeListDefaults,
    rows: systemPackages,
    status: { isLoading: false, code: 200, hasError: false },
    metadata: { total_items: 1 }
};

const initStore = (state) => {
    const mockStore = configureStore([]);
    return mockStore({ PackagesListStore: state });
};

let store = initStore(mockState);
beforeEach(() => {
    store.clearActions();
    render(<ComponentWithContext renderOptions={{ store }}>
        <Packages />
    </ComponentWithContext>);
});

describe('Packages.js', () => {

    it('should render the packages names correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <Router><Packages /></Router>
            </Provider>
        );
        expect(queryByText(container, 'test-name')).not.toBeNull();
        expect(queryByText(container, 'test-name-2')).not.toBeNull();
    });

    it('should render the packages summary', () => {
        const { container } = render(
            <Provider store={store}>
                <Router><Packages /></Router>
            </Provider>
        );
        expect(queryAllByText(container, 'Access control list utilities')).not.toBeNull();
    });

    it('should fetch packages only once on load', () => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CHANGE_PACKAGES_LIST_PARAMS')).toHaveLength(1);
        expect(dispatchedActions.filter(item => item.type === 'FETCH_PACKAGES_LIST')).toHaveLength(1);
    });

    testExport(exportPackagesCSV, exportPackagesJSON);
});

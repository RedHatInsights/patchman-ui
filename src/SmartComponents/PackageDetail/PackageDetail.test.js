import PackageDetail from './PackageDetail';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import { storeListDefaults } from '../../Utilities/constants';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { packageDetailData } from '../../Utilities/RawDataForTesting';
import { queryByText } from '@testing-library/dom';

initMocks();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('../../SmartComponents/PackageSystems/PackageSystems', () => () => <div></div>
);

const mockState = {
    ...storeListDefaults,
    data: packageDetailData,
    status: { isLoading: false, code: 200, hasError: false }
};

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ PackageDetailStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ PackageDetailStore: state });
};

let store = initStore(mockState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ PackageDetailStore: mockState });
    });
});

afterEach(() => {
    useSelector.mockClear();
});

describe('PackageDetail.js', () => {
    it('should render the Header', ()  => {
        const { container } = render(
            <Provider store={store}>
                <Router><PackageDetail /></Router>
            </Provider>);
        expect(queryByText(container, 'Packages')).not.toBeNull();
    });

    it('should render the Text', ()  => {
        const { container } = render(
            <Provider store={store}>
                <Router><PackageDetail /></Router>
            </Provider>);
        expect(queryByText(container, 'Systems')).not.toBeNull();
    });

    it('should display Unavailable component on error', () => {
        const rejectedState = { ...mockState, status: { isLoading: false, code: 200, hasError: true } };
        const tempStore = initStore(rejectedState);
        useSelector.mockImplementation(callback => {
            return callback({ PackageDetailStore: rejectedState });
        });
        render(
            <Provider store={tempStore}>
                <Router>
                    <PackageDetail />
                </Router>
            </Provider>);
        const heading = screen.getByRole('heading', {
            name: /this page is temporarily unavailable/i
        });
        expect(heading).toBeTruthy();
    });
});

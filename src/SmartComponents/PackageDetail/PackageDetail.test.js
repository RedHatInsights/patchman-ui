import PackageDetail from './PackageDetail';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import { storeListDefaults } from '../../Utilities/constants';
import { BrowserRouter as Router } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import { packageDetailData } from '../../Utilities/RawDataForTesting';

initMocks();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

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

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => { };

    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ PackageDetailStore: mockState });
    });
    wrapper = mount(<Provider store={store}>
        <Router><PackageDetail /></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('PackageDetail.js', () => {
    it('should match the snapshot', ()  => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('shpuld clear notifications ans package detail store on unmount', () => {
        const dispatchedActions = store.getActions();

        expect(dispatchedActions.filter(
            item => item.type === '@@INSIGHTS-CORE/NOTIFICATIONS/CLEAR_NOTIFICATIONS')).toHaveLength(1);
        expect(dispatchedActions.filter(
            item => item.type === 'CLEAR_PACKAGE_DETAILS')).toHaveLength(1);
    });

    it('should display Unavailable component on error', () => {
        const rejectedState = { ...mockState, status: { isLoading: false, code: 200, hasError: true } };
        const tempStore = initStore(rejectedState);
        useSelector.mockImplementation(callback => {
            return callback({ PackageDetailStore: rejectedState });
        });
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><PackageDetail /></Router>
        </Provider>);
        expect(tempWrapper.find('Unavailable')).toBeTruthy();
    });
});

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

jest.mock('../../Utilities/Hooks', () => ({
    ...jest.requireActual('../../Utilities/Hooks'),
    useFeatureFlag: jest.fn(() => true)
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

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
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

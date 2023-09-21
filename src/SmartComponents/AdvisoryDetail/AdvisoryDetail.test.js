import { act } from 'react-dom/test-utils';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { storeListDefaults } from '../../Utilities/constants';
import { advisoryDetailRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import AdvisoryDetail from './AdvisoryDetail';
import { render } from '@testing-library/react';

initMocks();

jest.mock('../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader', () =>
    () => <div> hello </div>
);

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));
jest.mock('../../Utilities/Hooks', () => ({
    ...jest.requireActual('../../Utilities/Hooks'),
    useFeatureFlag: jest.fn(() => true)
}));

jest.mock('../AdvisorySystems/AdvisorySystems', () =>
    () =>  <div> hello </div>
);

const mockState = { ...storeListDefaults, ...advisoryDetailRows };

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  AdvisoryDetailStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  AdvisoryDetailStore: state });
};

// eslint-disable-next-line no-unused-vars
let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ AdvisoryDetailStore: mockState });
    });
    wrapper = mount(<Provider store={store}>
        <Router><AdvisoryDetail /></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('AdvisoryDetail.js', () => {
    it('Should match the snapshots', () => {
        const { asFragment } = render(
            <Provider store={store}>
                <Router><AdvisoryDetail /></Router>
            </Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('Should clear store on unmount', async () => {
        let tempWrapper;
        await act(async() => {
            tempWrapper = mount(
                <Provider store={store}>
                    <Router><AdvisoryDetail /></Router>
                </Provider>
            );
        });
        act(() => {
            tempWrapper.unmount();
        });
        const dispatchedActions = store.getActions();
        expect(dispatchedActions.filter(item => item.type === 'CLEAR_ENTITIES')).toHaveLength(1);
        expect(dispatchedActions.filter(item => item.type === 'CLEAR_ADVISORY_DETAILS')).toHaveLength(1);
    });

    it('Should display error page when status is rejected', () => {

        const rejectedState = { ...mockState, status: { hasError: true }, error: { detail: 'test' } };

        useSelector.mockImplementation(callback => {
            return callback({ AdvisoryDetailStore: rejectedState });
        });

        const tempStore = initStore(rejectedState);
        const tempWrapper = mount(<Provider store={tempStore}>
            <Router><AdvisoryDetail/></Router>
        </Provider>);

        expect(tempWrapper.find('Unavailable')).toBeTruthy();
    });

});

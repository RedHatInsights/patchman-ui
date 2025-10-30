import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { storeListDefaults } from '../../Utilities/constants';
import { advisoryDetailRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import AdvisoryDetail from './AdvisoryDetail';
import { mountWithRouterAndProvider } from '../../../config/rtlwrapper';
import { render, screen } from '@testing-library/react';

initMocks();

jest.mock('../../PresentationalComponents/AdvisoryHeader/AdvisoryHeader', () => () => (
  <div> hello </div>
));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('../AdvisorySystems/AdvisorySystems', () => () => <div> hello </div>);

const mockState = { ...storeListDefaults, ...advisoryDetailRows };

const initStore = (state) => {
  const customMiddleWare = () => (next) => (action) => {
    useSelector.mockImplementation((callback) => {
      return callback({ AdvisoryDetailStore: state });
    });
    next(action);
  };

  const mockStore = configureStore([customMiddleWare]);
  return mockStore({ AdvisoryDetailStore: state });
};

let store = initStore(mockState);

beforeEach(() => {
  store.clearActions();
  useSelector.mockImplementation((callback) => {
    return callback({ AdvisoryDetailStore: mockState });
  });
});

afterEach(() => {
  useSelector.mockClear();
});

describe('AdvisoryDetail.js', () => {
  it('Should match the snapshots', () => {
    const { asFragment } = mountWithRouterAndProvider(<AdvisoryDetail />, store);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should clear store on unmount', async () => {
    const { unmount } = await render(
      <Provider store={store}>
        <Router>
          <AdvisoryDetail />
        </Router>
      </Provider>,
    );
    unmount();

    const dispatchedActions = store.getActions();
    expect(dispatchedActions.filter((item) => item.type === 'CLEAR_ENTITIES')).toHaveLength(1);
    expect(dispatchedActions.filter((item) => item.type === 'CLEAR_ADVISORY_DETAILS')).toHaveLength(
      1,
    );
  });

  it('Should display error page when status is rejected', () => {
    const rejectedState = { ...mockState, status: { hasError: true }, error: { detail: 'test' } };

    useSelector.mockImplementation((callback) => {
      return callback({ AdvisoryDetailStore: rejectedState });
    });

    const tempStore = initStore(rejectedState);
    render(
      <Provider store={tempStore}>
        <Router>
          <AdvisoryDetail />
        </Router>
      </Provider>,
    );
    expect(
      screen.getByRole('heading', {
        name: /this page is temporarily unavailable/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        // eslint-disable-next-line max-len
        /try refreshing the page\. if the problem persists, contact your organization administrator or visit our status page for known outages\./i,
      ),
    ).toBeTruthy();
  });
});

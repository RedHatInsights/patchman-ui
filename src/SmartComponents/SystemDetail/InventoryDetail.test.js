import InventoryDetail from './InventoryDetail';
import { render } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { entityDetail } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks, mountWithIntl } from '../../Utilities/unitTestingUtilities.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { InventoryDetailHead } from '@redhat-cloud-services/frontend-components/Inventory';
import { useFeatureFlag } from '../../Utilities/hooks';

initMocks();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    inventoryId: 'test-system-id',
  }),
  useRouteMatch: () => ({ url: '/systems/test-system-id' }),
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
  InventoryDetailHead: jest.fn(() => (
    <div className='testInventoryDetailHead'>
      <div>This is child</div>
    </div>
  )),
  DetailWrapper: jest.fn(({ children }) => (
    <div className='testDetailWrapper'>
      <div>{children}</div>
    </div>
  )),
}));
jest.mock('./SystemDetail', () => () => <div>This is system detail</div>);

const mockState = { ...entityDetail, SystemDetailStore: {} };

const initStore = (state) => {
  const customMiddleWare = () => (next) => (action) => {
    useSelector.mockImplementation((callback) =>
      callback({ entityDetails: state, SystemDetailStore: state }),
    );
    next(action);
  };

  const mockStore = configureStore([customMiddleWare]);
  return mockStore({ entityDetails: state, SystemDetailStore: state });
};

let store = initStore(mockState);

beforeEach(() => {
  console.error = () => {};

  store.clearActions();
  useSelector.mockImplementation((callback) =>
    callback({ entityDetails: mockState, SystemDetailStore: {} }),
  );
});

afterEach(() => {
  useSelector.mockClear();
});

describe('InventoryPage.js', () => {
  it('Should match the snapshots', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router>
          <InventoryDetail />
        </Router>
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should hide all dropdown actions when patch template flag is disabled', () => {
    useFeatureFlag.mockReturnValueOnce(false);
    const tempWrapper = mountWithIntl(
      <Provider store={store}>
        <Router>
          <InventoryDetail />
        </Router>
      </Provider>,
    );

    const { actions } = tempWrapper.find(InventoryDetailHead).props();
    expect(actions.length).toEqual(undefined);
  });
});

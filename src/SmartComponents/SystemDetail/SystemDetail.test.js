import SystemDetail from './SystemDetail';
import { useLocation, BrowserRouter as Router } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { systemAdvisoryRows, systemPackages } from '../../Utilities/RawDataForTesting';
import { storeListDefaults } from '../../Utilities/constants';

const mockState = {
  metadata: {
    limit: 25,
    offset: 0,
    total_items: 10,
  },
  expandedRows: {},
  selectedRows: { 'RHSA-2020:2774': true },
  queryParams: {},
  error: {},
  status: {},
  rows: systemAdvisoryRows,
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => () => {}),
}));

const initStore = (state) => {
  const customMiddleWare = () => (next) => (action) => {
    useSelector.mockImplementation((callback) => callback({ SystemAdvisoryListStore: state }));
    next(action);
  };

  const mockStore = configureStore([customMiddleWare]);
  return mockStore({ SystemAdvisoryListStore: state });
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ state: 'advisories' })),
}));
let store = initStore(mockState);

describe('SystemDetail.js', () => {
  it('Should match the snapshots', () => {
    useSelector.mockImplementation((callback) =>
      callback({
        SystemAdvisoryListStore: mockState,
        SystemPackageListStore: { ...storeListDefaults, rows: systemPackages },
      }),
    );

    const { asFragment } = render(
      <Provider store={store}>
        <Router>
          <SystemDetail />
        </Router>
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should match the snapshot when Package tab is active by default', () => {
    useLocation.mockImplementation(() => ({ state: { tab: 'packages' } }));
    const { asFragment } = render(
      <Provider store={store}>
        <Router>
          <SystemDetail />
        </Router>
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

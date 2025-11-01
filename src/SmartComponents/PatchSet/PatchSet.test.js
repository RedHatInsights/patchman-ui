import React from 'react';
import { render } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { storeListDefaults } from '../../Utilities/constants';
import { createPatchSetRows } from '../../Utilities/DataMappers';
import patchSets from '../../../cypress/fixtures/api/patchSets.json';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import PatchSet from './PatchSet';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(() => ({ location: { search: 'test-search' }, push: () => {} })),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(() => ({
    auth: {
      getUser: () =>
        new Promise((resolve) => resolve({ entitlements: { 'test-entitelement': true } })),
    },
  })),
}));

initMocks();

const mockState = {
  ...storeListDefaults,
  rows: createPatchSetRows(patchSets.data, {}, {}),
  status: { isLoading: false, code: 200, hasError: false },
  metadata: {
    limit: 25,
    offset: 0,
    total_items: 10,
  },
};

const initStore = (state) => {
  const customMiddleWare = () => (next) => (action) => {
    useSelector.mockImplementation((callback) => {
      return callback({ PatchSetsStore: state });
    });
    next(action);
  };

  const mockStore = configureStore([customMiddleWare]);
  return mockStore({ PatchSetsStore: state });
};

let store = initStore(mockState);
beforeEach(() => {
  store.clearActions();
  useSelector.mockImplementation((callback) => {
    return callback({ PatchSetsStore: mockState });
  });
});

describe('HeaderBreadcrumbs', () => {
  it('Should render correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Router>
          <PatchSet history={{ location: {}, push: () => {} }} />
        </Router>
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

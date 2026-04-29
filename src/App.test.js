import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { useFlagsStatus } from '@unleash/proxy-client-react';
import useFeatureFlag from './Utilities/hooks/useFeatureFlag';
import { featureFlags, KESSEL_API_BASE_URL } from './Utilities/constants';
import App from './App';

jest.mock('./Routes', () => ({
  __esModule: true,
  default: () => <div data-testid='routes-mock'>Routes</div>,
}));

jest.mock('@unleash/proxy-client-react', () => ({
  useFlagsStatus: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/RBACProvider', () => ({
  RBACProvider: jest.fn(({ children }) => children),
}));

jest.mock('@project-kessel/react-kessel-access-check', () => ({
  AccessCheck: {
    Provider: jest.fn(({ children }) => children),
  },
}));

const mockStore = configureStore([]);
const store = mockStore({});

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

describe('App.js tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFlagsStatus.mockReturnValue({ flagsReady: true });
    useFeatureFlag.mockImplementation(() => false);
  });

  it('does not mount routes or either provider until feature flags are ready', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: false });

    renderApp();

    expect(screen.queryByTestId('routes-mock')).not.toBeInTheDocument();
    expect(RBACProvider).not.toHaveBeenCalled();
    expect(AccessCheck.Provider).not.toHaveBeenCalled();
  });

  it('uses RBACProvider when Kessel is disabled', () => {
    renderApp();

    expect(RBACProvider).toHaveBeenCalledTimes(1);
    expect(RBACProvider).toHaveBeenCalledWith(
      expect.objectContaining({ appName: 'patch' }),
      expect.anything(),
    );
    expect(AccessCheck.Provider).not.toHaveBeenCalled();
    expect(screen.getByTestId('routes-mock')).toBeInTheDocument();
  });

  it('uses AccessCheck.Provider when Kessel is enabled', () => {
    useFeatureFlag.mockImplementation((flag) =>
      flag === featureFlags.kessel_enabled ? true : false,
    );

    renderApp();

    expect(AccessCheck.Provider).toHaveBeenCalledTimes(1);
    expect(AccessCheck.Provider).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: window.location.origin,
        apiPath: KESSEL_API_BASE_URL,
      }),
      expect.anything(),
    );
    expect(RBACProvider).not.toHaveBeenCalled();
    expect(screen.getByTestId('routes-mock')).toBeInTheDocument();
  });
});

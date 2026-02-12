import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import Systems from './SystemsMainContent';
import { render, screen, waitFor } from '@testing-library/react';
import { ComponentWithContext } from '../../Utilities/TestingUtilities';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

initMocks();

jest.mock('./SystemsTable', () => ({
  __esModule: true,
  default: jest.fn(
    ({ openAssignSystemsModal, openUnassignSystemsModal, activateRemediationModal, ...props }) => (
      <div {...props} data-testid='systems-table-mock'>
        <button data-testid='open-assign-modal' onClick={openAssignSystemsModal} />
        <button
          data-testid='open-unasssign-modal'
          onClick={() => openUnassignSystemsModal(['test-system-id-1'])}
        />
        <button data-testid='active-remediation-modal' onClick={activateRemediationModal} />
        Systems table
      </div>
    ),
  ),
}));

jest.mock('../../PresentationalComponents/Filters/OsVersionFilter');

jest.mock('../Remediation/RemediationWizard', () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <div {...props} data-testid='remediation-wizard-mock'>
      Remediation wizard
    </div>
  )),
}));

jest.mock('../../Utilities/api', () => ({
  fetchSystems: jest.fn(() =>
    Promise.resolve({
      meta: {
        subtotals: { patched: 10, unpatched: 5, stale: 20 },
      },
    }),
  ),
  fetchIDs: jest.fn(() => Promise.resolve({ data: [{ id: 'test-system-id-1' }] })),
  fetchApplicableSystemAdvisoriesApi: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          attributes: {
            advisory_type: 2,
            description: 'The tzdata penhancements.',
            public_date: '2020-10-19T15:02:38Z',
            synopsis: 'tzdata enhancement update',
          },
          id: 'RHBA-2020:4282',
          type: 'advisory',
        },
      ],
    }),
  ),
}));

const mockState = {
  entities: {
    metadata: {
      has_systems: true,
    },
    selectedRows: [{ 'test-system-id-1': true }],
    status: { hasError: false, code: 200 },
  },
  GlobalFilterStore: { selectedTags: [], selectedGlobalTags: [] },
  SystemsStore: {
    queryParams: {},
  },
};

const initStore = (state) => {
  const mockStore = configureStore([]);
  return mockStore(state);
};

const renderComponent = async (mockedStore) => {
  render(
    <ComponentWithContext renderOptions={{ store: initStore(mockedStore) }}>
      <Systems />
    </ComponentWithContext>,
  );
};

const user = userEvent.setup();
describe('SystemsTable', () => {
  it('Should display systems table when there are no errors', async () => {
    renderComponent(mockState);
    expect(screen.getByTestId('systems-table-mock')).toBeVisible();
  });

  it('Should display systems status report cards', async () => {
    renderComponent(mockState);
    await waitFor(() => {
      expect(screen.getByText('Stale systems')).toBeVisible();
      expect(screen.getByText('20')).toBeVisible();

      expect(screen.getByText('Systems with patches available')).toBeVisible();
      expect(screen.getByText('5')).toBeVisible();

      expect(screen.getByText('Systems up to date')).toBeVisible();
      expect(screen.getByText('10')).toBeVisible();
    });
  });

  it('Should display not found component when status is rejected', () => {
    const noAccessState = {
      ...mockState,
      entities: {
        metadata: {
          has_systems: true,
        },
        status: { hasError: true, code: 403 },
      },
    };
    renderComponent(noAccessState);
    expect(screen.getByText('You do not have permissions to view or manage Patch')).toBeTruthy();
  });

  it('Should display NoRegisteredSystems component if there are no systems registered', () => {
    const noSystemState = {
      ...mockState,
      SystemsStore: {
        metadata: {
          has_systems: false,
        },
      },
    };

    renderComponent(noSystemState);
    expect(screen.getByText(`Do more with your Red Hat Enterprise Linux environment`)).toBeTruthy();
  });

  it('Should display unassign systems modal', async () => {
    renderComponent(mockState);
    await user.click(screen.getByTestId('open-unasssign-modal'));
    await waitFor(() => expect(screen.getByTestId('unassign-systems-modal')).toBeVisible());
  });

  it('Should display remediation wizard', async () => {
    renderComponent(mockState);
    await user.click(screen.getByTestId('active-remediation-modal'));
    expect(screen.getByTestId('remediation-wizard-mock')).toBeVisible();
  });
});

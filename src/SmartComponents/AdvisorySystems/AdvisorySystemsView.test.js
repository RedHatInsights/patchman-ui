import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { preloadModule } from '@scalprum/core';
import AdvisorySystems from './AdvisorySystemsView.tsx';

const mockAddNotification = jest.fn();
const mockWizardProps = {};

jest.mock('@scalprum/core', () => ({
  ...jest.requireActual('@scalprum/core'),
  preloadModule: jest.fn(() => Promise.resolve()),
}));

jest.mock('@redhat-cloud-services/frontend-components-notifications', () => ({
  useAddNotification: () => mockAddNotification,
}));

jest.mock('../Remediation/RemediationWizard', () => ({
  __esModule: true,
  default: (props) => {
    mockWizardProps.current = props;
    return <div data-testid='remediation-wizard-mock'>Remediation wizard</div>;
  },
}));

jest.mock('../../Utilities/api/api', () => ({
  ...jest.requireActual('../../Utilities/api/api'),
  fetchApplicableSystemAdvisoriesApi: jest.fn(() =>
    Promise.resolve({
      data: [{ id: 'RHBA-2020:4282' }],
      meta: { total_items: 1 },
    }),
  ),
}));

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => ({
  __esModule: true,
  default: ({ bulkActions, rowActions }) => {
    const action = bulkActions?.[0];
    const rowAction = rowActions?.[0];
    const helpers = {
      invalidateQuery: async () => undefined,
      clearSelection: () => undefined,
    };
    const applicableSystem = { id: 'system-applicable', attributes: { status: 'Applicable' } };
    const installableSystem = { id: 'system-installable', attributes: { status: 'Installable' } };

    return (
      <div>
        <span data-testid='plan-remediation-label'>{action?.label}</span>
        <span data-testid='disabled-empty'>{String(action?.isDisabled?.([]))}</span>
        <span data-testid='disabled-selected'>
          {String(action?.isDisabled?.([{ id: 'system-1' }]))}
        </span>
        <span data-testid='row-disabled-applicable'>
          {String(rowAction?.isDisabled?.([applicableSystem]))}
        </span>
        <span data-testid='row-disabled-installable'>
          {String(rowAction?.isDisabled?.([installableSystem]))}
        </span>
        <button type='button' onClick={() => action?.onAction([{ id: 'system-1' }], helpers)}>
          Open plan remediation
        </button>
        <button type='button' onClick={() => rowAction?.onAction([installableSystem], helpers)}>
          Apply all applicable advisories
        </button>
      </div>
    );
  },
}));

describe('AdvisorySystems SystemsView remediation', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockAddNotification.mockClear();
    mockWizardProps.current = undefined;
    preloadModule.mockClear();
  });

  it('preloads the remediation wizard with the table', () => {
    render(<AdvisorySystems advisoryName='RHSA-2020:2755' />);

    expect(preloadModule).toHaveBeenCalledWith('remediations', './RemediationWizard');
  });

  it('disables Plan remediation until a system is selected', () => {
    render(<AdvisorySystems advisoryName='RHSA-2020:2755' />);

    expect(screen.getByTestId('plan-remediation-label')).toHaveTextContent('Plan remediation');
    expect(screen.getByTestId('disabled-empty')).toHaveTextContent('true');
    expect(screen.getByTestId('disabled-selected')).toHaveTextContent('false');
    expect(screen.queryByTestId('remediation-wizard-mock')).not.toBeInTheDocument();
  });

  it('opens the remediation wizard for the advisory and selected systems', async () => {
    render(<AdvisorySystems advisoryName='RHSA-2020:2755' />);

    await user.click(screen.getByRole('button', { name: 'Open plan remediation' }));

    expect(screen.getByTestId('remediation-wizard-mock')).toBeVisible();
    expect(mockWizardProps.current?.data).toEqual(
      expect.objectContaining({
        issues: [
          {
            id: 'patch-advisory:RHSA-2020:2755',
            description: 'RHSA-2020:2755',
          },
        ],
        systems: ['system-1'],
      }),
    );
    expect(mockWizardProps.current?.setRemediationOpen).toEqual(expect.any(Function));
  });

  it('disables Apply all applicable advisories when the system status is Applicable', () => {
    render(<AdvisorySystems advisoryName='RHSA-2020:2755' />);

    expect(screen.getByRole('button', { name: 'Apply all applicable advisories' })).toBeVisible();
    expect(screen.getByTestId('row-disabled-applicable')).toHaveTextContent('true');
    expect(screen.getByTestId('row-disabled-installable')).toHaveTextContent('false');
  });

  it('opens the remediation wizard with the system installable advisories', async () => {
    render(<AdvisorySystems advisoryName='RHSA-2020:2755' />);

    await user.click(screen.getByRole('button', { name: 'Apply all applicable advisories' }));

    await waitFor(() => {
      expect(screen.getByTestId('remediation-wizard-mock')).toBeVisible();
    });
    expect(mockWizardProps.current?.data).toEqual({
      issues: [
        {
          id: 'patch-advisory:RHBA-2020:4282',
          description: 'RHBA-2020:4282',
        },
      ],
      systems: ['system-installable'],
    });
  });

  it('shows a notification after a remediation is created', async () => {
    render(<AdvisorySystems advisoryName='RHSA-2020:2755' />);

    await user.click(screen.getByRole('button', { name: 'Open plan remediation' }));

    const notification = { title: 'Remediation created', variant: 'success' };
    mockWizardProps.current.data.onRemediationCreated({
      getNotification: () => notification,
    });

    expect(mockAddNotification).toHaveBeenCalledWith(notification);
  });
});

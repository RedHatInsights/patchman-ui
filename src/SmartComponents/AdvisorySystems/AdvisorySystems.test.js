import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import AdvisorySystems from './AdvisorySystems';
import { render, screen } from '@testing-library/react';
import { ComponentWithContext } from '../../Utilities/TestingUtilities';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

initMocks();

jest.mock('./AdvisorySystemsTable', () => ({
    __esModule: true,
    default: jest.fn(({ activateRemediationModal, ...props }) => {
        return (
            <div {...props} data-testid='systems-table-mock'>
                <button data-testid='active-remediation-modal' onClick={activateRemediationModal}/>
                Systems table
            </div>
        );
    })
}));

jest.mock(
    '../../PresentationalComponents/Filters/OsVersionFilter'
);

jest.mock('../Remediation/RemediationWizard', () => ({
    __esModule: true,
    default: jest.fn((props) => (
        <div {...props} data-testid='remediation-wizard-mock'>
            Remediation wizard
        </div>
    ))
}));

jest.mock('../../Utilities/api', () => ({
    fetchSystems: jest.fn(() => Promise.resolve({
        meta: {
            subtotals: { patched: 10, unpatched: 5, stale: 20 }
        }
    })),
    fetchIDs: jest.fn(() => Promise.resolve({ data: [{ id: 'test-system-id-1' }] })),
    fetchApplicableSystemAdvisoriesApi: jest.fn(() => Promise.resolve({
        data: [{
            attributes: {
                advisory_type: 2,
                description: 'The tzdata penhancements.',
                public_date: '2020-10-19T15:02:38Z',
                synopsis: 'tzdata enhancement update'
            },
            id: 'RHBA-2020:4282',
            type: 'advisory'
        }]
    }))
}));

const mockState = {
    entities: {
        metadata: {
            has_systems: true
        },
        selectedRows: [{ 'test-system-id-1': true }],
        status: { hasError: false, code: 200 }
    },
    GlobalFilterStore: { selectedTags: [], selectedGlobalTags: [] },
    AdvisorySystemsStore: {
        queryParams: {}
    }
};

const initStore = (state) => {
    const mockStore = configureStore([]);
    return mockStore(state);
};

const renderComponent = async (mockedStore) => {
    render(<ComponentWithContext renderOptions={{ store: initStore(mockedStore) }}>
        <AdvisorySystems />
    </ComponentWithContext>);
};

const user = userEvent.setup();
describe('AdvisorySystems', () => {
    it('Should display systems table when there are no errors', async () => {
        renderComponent(mockState);
        expect(screen.getByTestId('systems-table-mock')).toBeVisible();
    });

    it('Should display unauthorised component when status is rejected', () => {
        const noAccessState = {
            ...mockState,
            entities: {
                metadata: {
                    has_systems: true
                },
                status: { hasError: true, code: 403 }
            }
        };
        renderComponent(noAccessState);
        expect(
            screen.getByText('You do not have permissions to view or manage Patch')
        ).toBeTruthy();
    });

    it('Should display NoRegisteredSystems component if there are no systems registered', () => {
        const noSystemState = {
            ...mockState,
            AdvisorySystemsStore: {
                metadata: {
                    has_systems: false
                }
            }
        };

        renderComponent(noSystemState);
        expect(
            screen.getByText(`Do more with your Red Hat Enterprise Linux environment`)
        ).toBeTruthy();
    });

    it('Should display remediation wizard', async () => {
        renderComponent(mockState);
        await user.click(screen.getByTestId('active-remediation-modal'));
        expect(screen.getByTestId('remediation-wizard-mock')).toBeVisible();
    });
});

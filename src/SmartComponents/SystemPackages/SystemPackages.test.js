import SystemPackages from './SystemPackages';
import { systemPackages } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { storeListDefaults, remediationIdentifiers } from '../../Utilities/constants';
import { fetchIDs } from '../../Utilities/api';
import { remediationProvider } from '../../Utilities/Helpers';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { ComponentWithContext, testBulkSelection } from '../../Utilities/TestingUtilities.js';
import '@testing-library/jest-dom';

initMocks();

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchIDs: jest.fn(() => Promise.resolve({
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
    }).catch((err) => console.log(err)))
}));

jest.mock('../../Utilities/Helpers', () => ({
    ...jest.requireActual('../../Utilities/Helpers'),
    encodeApiParams: jest.fn(),
    remediationProvider: jest.fn()
}));
jest.mock('../Remediation/AsyncRemediationButton', () => ({
    __esModule: true,
    default: jest.fn(({ remediationProvider, ...props }) => {
        remediationProvider();
        return (
            <div {...props} data-testid='remediation-mock'>
            Remediation
            </div>
        );
    }
    )
}));

const mockState = {
    ...storeListDefaults,
    rows: systemPackages,
    status: { code: 200, isLoading: false, hasError: false },
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 10
    }
};

const mountComponent = async (state, componentProps) => {
    const initStore = (state) => {
        const mockStore = configureStore([]);
        return mockStore({  SystemPackageListStore: state });
    };

    render(<ComponentWithContext renderOptions={{ store: initStore(state) }}>
        <SystemPackages inventoryId='entity' {...componentProps} />
    </ComponentWithContext>);
};

describe('Selection', () => {
    beforeEach(async () =>{
        await mountComponent(mockState);
        await waitFor(() => screen.getByLabelText('Patch table view'));
    });
    testBulkSelection(
        fetchIDs,
        '/systems/entity/packages',
        'selectSystemPackagesRow',
        {}
    );
});

describe('SystemPackages', () => {

    it('Should provide correct remediation data', async () => {
        const selectedState = {
            ...mockState,
            selectedRows: { 'test-id-0': 'test-id-0' }
        };

        await mountComponent(selectedState);
        await waitFor(() => screen.getByLabelText('Patch table view'));

        fireEvent.click(screen.getByText('Remediation'));
        await waitFor(() => {
            expect(remediationProvider).toHaveBeenCalledWith(['test-id-0'], 'entity', remediationIdentifiers.package);
        });
    });

    it('Should render no access component', async () => {
        const rejectedState = {
            ...mockState,
            status: { code: 403, isLoading: false, hasError: true },
            error: { detail: 'test' }
        };

        await mountComponent(rejectedState);

        expect(screen.getByText('You do not have permissions to view or manage Patch')).toBeVisible();
    });

    it('Should display SystemUpToDate when status is resolved, but there is no items', async () => {
        const emptyState = {
            ...mockState,
            metadata: {
                ...mockState.metadata,
                total_items: 0,
                has_systems: false
            },
            queryParams: {}
        };

        await mountComponent(emptyState);
        expect(screen.getByText('No applicable advisories')).toBeVisible();
    });

    it('Should display Unavailable component when there is a generic error', async () => {
        const unavailableState = {
            ...mockState,
            status: { code: 500, isLoading: false, hasError: true }
        };

        await mountComponent(unavailableState);
        expect(screen.getByText('This page is temporarily unavailable')).toBeVisible();
    });

    it('Should display NotConnected', async () => {
        const notFoundState = {
            ...mockState,
            status: { code: 404, isLoading: false, hasError: true },
            error: {
                status: 404,
                title: 'testTitle',
                detail: 'testDescription'
            }
        };

        const handleNoSystemData = jest.fn(() => () => <div>Mocked component</div>);

        await mountComponent(notFoundState, { handleNoSystemData });

        expect(handleNoSystemData).toHaveBeenCalled();
    });
});

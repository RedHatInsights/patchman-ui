import SystemAdvisories from './SystemAdvisories';
import { systemAdvisoryRows } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { fetchIDs } from '../../Utilities/api';
import { ComponentWithContext, testBulkSelection } from '../../Utilities/TestingUtilities.js';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton.js';
import { render, waitFor, queryByText } from '@testing-library/react';

initMocks();

jest.mock('../../Utilities/Helpers', () => ({
    ...jest.requireActual('../../Utilities/Helpers'),
    remediationProvider: jest.fn()
}));
jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchIDs: jest.fn(() => Promise.resolve({ ids: [] }).catch((err) => console.log(err)))
}));
jest.mock('../Remediation/AsyncRemediationButton', () => ({
    __esModule: true,
    default: jest.fn((props) => (
        <div {...props} data-testid='remediation-mock'>
            Remediation
        </div>
    ))
}));

const mockState = {
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 10
    },
    expandedRows: {},
    selectedRows: { 'RHSA-2020:2774': true },
    queryParams: {},
    error: {},
    status: {},
    rows: systemAdvisoryRows
};

const initStore = (state) => {
    const mockStore = configureStore([]);
    return mockStore({  SystemAdvisoryListStore: state });
};

let store = initStore(mockState);
beforeEach(() => {
    render(<ComponentWithContext renderOptions={{ store }}>
        <SystemAdvisories inventoryId='test' />
    </ComponentWithContext>);
});

describe('SystemAdvisories.js', () => {
    it('should handle remediation', async() => {
        const selectedState = {
            ...mockState,
            selectedRows: { 'RHSA-2020:2774': true }
        };

        const tempStore = initStore(selectedState);
        render(
            <ComponentWithContext renderOptions={{ store: tempStore }}>
                <SystemAdvisories inventoryId='test' />
            </ComponentWithContext>
        );

        waitFor(() => {
            expect(AsyncRemediationButton).toHaveBeenCalledWith({
                isDisabled: false,
                isLoading: false,
                remediationProvider: expect.any(Function)
            });
        });
    });

    testBulkSelection(
        fetchIDs,
        '/ids/systems/test/advisories',
        'selectSystemAdvisoryRow',
        {
            limit: -1,
            offset: 0
        });

    it('Should display SystemUpToDate when status is resolved, but there is no items', async () => {
        const emptyState = {
            ...mockState,
            metadata: {
                limit: 25,
                offset: 0,
                total_items: 0,
                search: 'test',
                filter: {}
            }
        };

        const tempStore = initStore(emptyState);
        const { container } = render(<ComponentWithContext renderOptions={{ store: tempStore }}>
            <SystemAdvisories inventoryId='test' />
        </ComponentWithContext>);

        await waitFor(() => queryByText(container, 'No applicable advisories'));
    });
});


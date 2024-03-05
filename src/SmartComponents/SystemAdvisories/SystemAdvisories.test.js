import SystemAdvisories from './SystemAdvisories';
import { systemAdvisoryRows } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { fetchIDs } from '../../Utilities/api';
import { ComponentWithContext, testBulkSelection } from '../../Utilities/TestingUtilities.js';
import { render, waitFor, screen } from '@testing-library/react';

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
        total_items: 101
    },
    expandedRows: {},
    selectedRows: {},
    queryParams: {},
    error: {},
    status: {},
    rows: systemAdvisoryRows
};

const initStore = (state) => {
    const mockStore = configureStore([]);
    return mockStore({  SystemAdvisoryListStore: state });
};

describe('Selection',  () => {
    beforeEach(() => {
        const store = initStore(mockState);
        render(<ComponentWithContext renderOptions={{ store }}>
            <SystemAdvisories inventoryId='test' />
        </ComponentWithContext>);
    });

    testBulkSelection(
        fetchIDs,
        '/ids/systems/test/advisories',
        'selectSystemAdvisoryRow',
        [
            {
                id: 'RHSA-2020:2774',
                selected: 'RHSA-2020:2774'
            }
        ]
    );
});

describe('SystemAdvisories.js', () => {
    it('should render remediation button', async () => {
        render(
            <ComponentWithContext renderOptions={{ store: initStore(mockState) }}>
                <SystemAdvisories inventoryId='test' />
            </ComponentWithContext>
        );

        expect(screen.getByText('Remediation')).toBeVisible();
    });

    it('Should display SystemUpToDate when status is resolved, but there are no applicable advisories', async () => {
        const emptyState = {
            ...mockState,
            metadata: {
                limit: 25,
                offset: 0,
                total_items: 0,
                filter: {}
            },
            rows: []
        };

        render(<ComponentWithContext renderOptions={{ store: initStore(emptyState) }}>
            <SystemAdvisories inventoryId='test' />
        </ComponentWithContext>);

        await waitFor(() =>
            expect(screen.getByText('No applicable advisories')).toBeInTheDocument()
        );
    });

    it('Should display EmptyAdvisoryList when status is resolved, but there are no items', async () => {
        const emptyState = {
            ...mockState,
            metadata: {
                limit: 25,
                offset: 0,
                total_items: 0,
                search: 'test',
                filter: {}
            },
            rows: []
        };

        render(<ComponentWithContext renderOptions={{ store: initStore(emptyState) }}>
            <SystemAdvisories inventoryId='test' />
        </ComponentWithContext>);

        await waitFor(() =>
            expect(screen.getByText('No matching advisories found')).toBeInTheDocument()
        );
    });
});


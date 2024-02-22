import Advisories from './Advisories';
import { advisoryRows } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { storeListDefaults } from '../../Utilities/constants';
import {
    exportAdvisoriesCSV, exportAdvisoriesJSON, fetchIDs
} from '../../Utilities/api';
import AsyncRemediationButton from '../Remediation/AsyncRemediationButton';
import { ComponentWithContext, testBulkSelection, testExport } from '../../Utilities/TestingUtilities.js';
import '@testing-library/jest-dom';
import { waitFor, render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';
import '@testing-library/jest-dom';

initMocks();

jest.mock('@redhat-cloud-services/frontend-components-utilities/helpers', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components-utilities/helpers'),
    downloadFile: jest.fn()
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    exportAdvisoriesJSON: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    exportAdvisoriesCSV: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchSystems: jest.fn(() => Promise.resolve({ data: { id: 'testId' } }).catch((err) => console.log(err))),
    fetchViewAdvisoriesSystems: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err))),
    fetchIDs: jest.fn(() => Promise.resolve({ ids: [] }).catch((err) => console.log(err))),
    fetchApplicableAdvisoriesApi: jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)))
}));

jest.mock('../../Utilities/constants', () => ({
    ...jest.requireActual('../../Utilities/constants'),
    publicDateOptions: jest.fn().mockReturnValue([]),
    advisorySeverities: [{
        value: 0,
        label: 'N/A',
        color: 'var(--pf-global--Color--200)'
    }]
}));
jest.mock('../Remediation/AsyncRemediationButton', () => ({
    __esModule: true,
    default: jest.fn((props) => (
        <div {...props} data-testid='remediation-mock'>
            Remediation
        </div>
    ))
}));

const mockState = { ...storeListDefaults,
    rows: advisoryRows,
    status: { isLoading: false, code: 200, hasError: false },
    metadata: {
        limit: 25,
        offset: 0,
        total_items: 10
    }
};

const initStore = (state) => {
    const mockStore = configureStore([]);
    return mockStore({  AdvisoryListStore: state });
};

let store = initStore(mockState);

beforeEach(() => {
    render(<ComponentWithContext renderOptions={{ store }}>
        <Advisories/>
    </ComponentWithContext>);
});

describe('Advisories.js', () => {
    testExport(exportAdvisoriesCSV, exportAdvisoriesJSON, 'advisories');

    testBulkSelection(
        fetchIDs,
        '/ids/advisories',
        'selectAdvisoryRow',
        {
            id: 'RHEA-2020:2743',
            selected: 'RHEA-2020:2743'
        }
    );

    it('Should display error page when status is rejected', async () => {
        const rejectedState = {
            ...mockState,
            status: { isLoading: false, code: 400, hasError: true },
            error: {}
        };
        const tempStore = initStore(rejectedState);
        const { container } = render(<ComponentWithContext renderOptions={{ store: tempStore }}>
            <Advisories/>
        </ComponentWithContext>);

        await waitFor(
            () => expect(queryByText(container, 'This page is temporarily unavailable')).toBeVisible()
        );
    });

    it('should handle remediation', () => {
        const selectedState = {
            ...mockState,
            selectedRows: { 'RHEA-2020:2743': true }
        };

        const tempStore = initStore(selectedState);
        render(
            <ComponentWithContext renderOptions={{ store: tempStore }}>
                <Advisories />
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
});


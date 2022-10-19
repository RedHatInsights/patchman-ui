/**
 * @jest-environment jsdom
 */
import { act } from 'react-dom/test-utils';
import useRemediationDataProvider from './useRemediationDataProvider';
import {
} from './Helpers';
import {
    fetchViewAdvisoriesSystems,
    fetchViewSystemsAdvisories
} from './api';

jest.mock('./api', () => ({
    ...jest.requireActual('./api'),
    fetchViewAdvisoriesSystems: jest.fn().mockReturnValue(new Promise((resolve) => {
        resolve({ data: { testAdvisory: ['test-system'] } });
    })),
    fetchViewSystemsAdvisories: jest.fn().mockReturnValue(new Promise((resolve) => {
        resolve({ data: { testAdvisory: ['test-system'] } });
    }))
}));

const setRemediationLoading = jest.fn();
describe('useRemediationDataProvider', () => {
    it('Should return remediation data pairs', async () => {
        const testSystems = {
            'test-system-id-1': true,
            'test-system-id-2': true
        };

        const remediationProvider =  useRemediationDataProvider(testSystems, setRemediationLoading, 'advisories');
        const res = await remediationProvider();

        expect(res).toEqual({
            issues: [
                {
                    id: 'patch-advisory:testAdvisory',
                    description: 'testAdvisory',
                    systems: ['test-system']
                }
            ]
        }
        );
        expect(setRemediationLoading).toHaveBeenCalledTimes(2);
        expect(setRemediationLoading).toHaveBeenCalledWith(true);
        expect(setRemediationLoading).toHaveBeenCalledWith(false);
    });
});

describe('prepareRemedationPairs', () => {
    let manySystems = [{ 'test-system-id': true }];
    for (let i = 0; i < 100; i++) {
        manySystems.push({ [`test-system-id-${i}`]: true });
    }

    it('Should create correct number of api requests with chunk size of 100', async () => {
        const advisoryRemediationProvider = useRemediationDataProvider(manySystems, setRemediationLoading, 'systems');
        await act(() => advisoryRemediationProvider());

        expect(fetchViewSystemsAdvisories).toHaveBeenCalledTimes(2);
    });

    it('Should create only one api requests with chunk size of 100', async () => {
        let testSystems = [{ 'test-system-id': true }];

        const advisoryRemediationProvider = useRemediationDataProvider(testSystems, setRemediationLoading, 'systems');
        await act(() => advisoryRemediationProvider());

        expect(fetchViewSystemsAdvisories).toHaveBeenCalledTimes(3);
    });

    it('Should call the right API function according to remediationType', async () => {
        const testSystems = {
            'test-system-id-1': true,
            'test-system-id-2': true
        };

        const advisoryRemediationProvider = useRemediationDataProvider(testSystems, setRemediationLoading, 'advisories');
        await act(() => advisoryRemediationProvider());

        expect(fetchViewAdvisoriesSystems).toHaveBeenCalled();

        const sytemRemediationProvider = useRemediationDataProvider(testSystems, setRemediationLoading, 'systems');
        await act(() => sytemRemediationProvider());

        expect(fetchViewSystemsAdvisories).toHaveBeenCalled();
    });

    it('Should merge chunked API responses', async () => {
        fetchViewAdvisoriesSystems.mockReturnValueOnce(new Promise((resolve) => {
            resolve({ data: { testPair1: 'advisor-system-pair-issue' } });
        }))
        .mockReturnValueOnce(new Promise((resolve) => {
            resolve({ data: { testPair2: 'advisor-system-pair-issue' } });
        }));

        const advisoryRemediationProvider = useRemediationDataProvider(manySystems, setRemediationLoading, 'advisories');
        const response = await advisoryRemediationProvider();

        expect(response)
        .toEqual({
            issues: [
                {
                    description: 'testPair1',
                    id: 'patch-advisory:testPair1',
                    systems: 'advisor-system-pair-issue'
                },
                {
                    description: 'testPair2',
                    id: 'patch-advisory:testPair2',
                    systems: 'advisor-system-pair-issue'
                }
            ]
        });
    });
});

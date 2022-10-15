/**
 * @jest-environment jsdom
 */
import { act } from 'react-dom/test-utils';
import useRemediationDataProvider from './useRemediationDataProvider';
import {
    remediationProviderWithPairs,
    transformPairs
} from './Helpers';
import {
    fetchViewAdvisoriesSystems,
    fetchViewSystemsAdvisories
} from './api';

jest.mock('./Helpers', () => ({
    ...jest.requireActual('./Helpers'),
    remediationProviderWithPairs: jest.fn(() => Promise.resolve({
        data: [{
            id: 'RHBA-2020:4282',
            type: 'advisory'
        }]
    }).catch((err) => console.log(err)))
}));

jest.mock('./api', () => ({
    ...jest.requireActual('./api'),
    fetchViewAdvisoriesSystems: jest.fn().mockReturnValue({ data: { testPair: 'advisor-system-pair-issue' } }),
    fetchViewSystemsAdvisories: jest.fn().mockReturnValue({ data: { testPair: 'advisor-system-pair-issue' } })
}));

const setRemediationLoading = jest.fn();
describe('useRemediationDataProvider', () => {
    it('Should return remediation data pairs', async () => {
        const testSystems = {
            'test-system-id-1': true,
            'test-system-id-2': true
        };

        const remediationProvider =  useRemediationDataProvider(testSystems, setRemediationLoading, 'advisories');
        await act(() => remediationProvider());

        expect(remediationProviderWithPairs)
        .toHaveBeenCalledWith(
            { data: { testPair: 'advisor-system-pair-issue' } },
            transformPairs,
            'patch-advisory'
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
        fetchViewAdvisoriesSystems.mockReturnValueOnce({ data: { testPair1: 'advisor-system-pair-issue' } })
        .mockReturnValueOnce({ data: { testPair2: 'advisor-system-pair-issue' } });

        const advisoryRemediationProvider = useRemediationDataProvider(manySystems, setRemediationLoading, 'advisories');
        await act(() => advisoryRemediationProvider());

        expect(remediationProviderWithPairs)
        .toHaveBeenCalledWith(
            { data: { testPair1: 'advisor-system-pair-issue', testPair2: 'advisor-system-pair-issue' } },
            transformPairs,
            'patch-advisory'
        );
    });
});

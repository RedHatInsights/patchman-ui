/**
 * @jest-environment jsdom
 */
import { act } from 'react-dom/test-utils';
import useRemediationDataProvider from './useRemediationDataProvider';
import {
    remediationProviderWithPairs,
    transformPairs
} from './Helpers';

jest.mock('./Helpers', () => ({
    ...jest.requireActual('./Helpers'),
    remediationProviderWithPairs: jest.fn(() => Promise.resolve({
        data: [{
            id: 'RHBA-2020:4282',
            type: 'advisory'
        }]
    }).catch((err) => console.log(err)))
}));

const setRemediationLoading = jest.fn();
describe('useRemediationDataProvider', () => {

    global.Headers = jest.fn();
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => ({ testPair: 'advisor-system-pair-issue' })
    }).catch((err) => console.log(err)));

    it('Should return remediation data pairs', async () => {
        const testSystems = {
            'test-system-id-1': true,
            'test-system-id-2': true
        };

        const remediationProvider =  useRemediationDataProvider(testSystems, setRemediationLoading, 'advisories');
        await act(() => remediationProvider());

        expect(remediationProviderWithPairs)
        .toHaveBeenCalledWith(
            { testPair: 'advisor-system-pair-issue' },
            transformPairs,
            'patch-advisory'
        );
        expect(setRemediationLoading).toHaveBeenCalledTimes(2);
        expect(setRemediationLoading).toHaveBeenCalledWith(true);
        expect(setRemediationLoading).toHaveBeenCalledWith(false);
    });
});

/**
 * @jest-environment jsdom
 */
import { act } from 'react-dom/test-utils';
import useRemediationDataProvider from './useRemediationDataProvider';
import {
    remediationProviderWithPairs,
    transformPairs
} from '../../Utilities/Helpers';
import { prepareRemediationPairs } from './SystemsHelpers';

jest.mock('../../Utilities/Helpers', () => ({
    ...jest.requireActual('../../Utilities/Helpers'),
    remediationProviderWithPairs: jest.fn(() => Promise.resolve({
        data: [{
            id: 'RHBA-2020:4282',
            type: 'advisory'
        }]
    }).catch((err) => console.log(err)))
}));

const setRemediationLoading = jest.fn();
describe('useRemediationDataProvider', () => {
    it('Should return remediation data pairs', async () => {
        const testSystems = {
            'test-system-id-1': true,
            'test-system-id-2': true
        };

        const remediationProvider =  useRemediationDataProvider(testSystems, setRemediationLoading);
        await act(() => remediationProvider());

        expect(remediationProviderWithPairs)
        .toHaveBeenCalledWith(
            ['test-system-id-1', 'test-system-id-2'],
            prepareRemediationPairs,
            transformPairs,
            'patch-advisory'
        );
        expect(setRemediationLoading).toHaveBeenCalledTimes(2);
        expect(setRemediationLoading).toHaveBeenCalledWith(true);
        expect(setRemediationLoading).toHaveBeenCalledWith(false);
    });
});

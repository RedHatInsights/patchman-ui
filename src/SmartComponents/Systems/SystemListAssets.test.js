import { systemsListColumns, packageSystemsColumns, systemsRowActions } from './SystemsListAssets';
import { createAdvisoriesIcons, createUpgradableColumn, remediationProvider } from '../../Utilities/Helpers';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
/* eslint-disable */
jest.mock('../../Utilities/Helpers', () => ({
    ...jest.requireActual('../../Utilities/Helpers'),
    createAdvisoriesIcons: jest.fn(),
    createUpgradableColumn: jest.fn(),
    remediationProvider: jest.fn()
}));
jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchApplicableSystemAdvisoriesApi: jest.fn(() => Promise.resolve({ data: [ { id: 'testDataID' } ] }).catch((err) => console.log(err)))
}));

describe('SystemListAssets.js', () => {

    it('Should call systemsListColumns on Applicable advisories renderFunc with correct params', () => {
        systemsListColumns[4].renderFunc('testValue');
        expect(createAdvisoriesIcons).toHaveBeenCalledWith('testValue');
    });

    it('Should call createUpgradableColumn on Status renderFunc with correct params', () => {
        packageSystemsColumns[3].renderFunc('testValue');
        expect(createUpgradableColumn).toHaveBeenCalledWith('testValue');
    });

    describe('test systemsRowActions: ', () => {
        const testShowRemediationModal = jest.fn();
        const actions = systemsRowActions(testShowRemediationModal);
        actions[0].onClick(null, null, { id: 'testId' });
        it('Should call fetchApplicableSystemAdvisoriesApi with row id and limit: 10000', () => {
            expect(fetchApplicableSystemAdvisoriesApi).toHaveBeenCalledWith({
                id: 'testId',
                limit: 10000
            })
        });
        it('Should call remediationProvider and testShowRemediationModal', () => {
            expect(testShowRemediationModal).toHaveBeenCalled();
            expect(remediationProvider).toHaveBeenCalledWith(
                ['testDataID'],
                'testId',
                remediationIdentifiers.advisory
            )
        });
    });
});
/* eslint-enable */

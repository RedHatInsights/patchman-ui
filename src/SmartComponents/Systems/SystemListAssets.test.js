import { systemsListColumns, packageSystemsColumns, systemsRowActions } from './SystemsListAssets';
import { createAdvisoriesIcons, createUpgradableColumn, remediationProvider } from '../../Utilities/Helpers';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';

jest.mock('../../Utilities/Helpers', () => ({
    ...jest.requireActual('../../Utilities/Helpers'),
    createAdvisoriesIcons: jest.fn(),
    createUpgradableColumn: jest.fn(),
    remediationProvider: jest.fn()
}));
jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchApplicableSystemAdvisoriesApi:
        jest.fn(() => Promise.resolve({ data: [{ id: 'testDataID' }] }).catch((err) => console.log(err)))
}));

describe('SystemListAssets.js', () => {

    it('Should call systemsListColumns on Applicable advisories renderFunc with correct params', () => {
        systemsListColumns()[2].renderFunc('testValue');
        expect(createAdvisoriesIcons).toHaveBeenCalledWith('testValue', 'installable');
    });

    it('Should call createUpgradableColumn on Status renderFunc with correct params', () => {
        packageSystemsColumns[6].renderFunc('testValue');
        expect(createUpgradableColumn).toHaveBeenCalledWith('testValue');
    });

    describe('test systemsRowActions: ', () => {
        const testShowRemediationModal = jest.fn();
        const actions = systemsRowActions(testShowRemediationModal);
        actions[0].onClick(null, null, { id: 'testId' });
        it('Should call fetchApplicableSystemAdvisoriesApi with row id and limit: 10000', () => {
            expect(fetchApplicableSystemAdvisoriesApi).toHaveBeenCalledWith({
                id: 'testId',
                limit: -1,
                'filter[status]': 'in:Installable'
            });
        });
        it('Should call remediationProvider and testShowRemediationModal', () => {
            expect(testShowRemediationModal).toHaveBeenCalled();
            expect(remediationProvider).toHaveBeenCalledWith(
                ['testDataID'],
                'testId',
                remediationIdentifiers.advisory
            );
        });
        it('Should disable "Apply all applicable advisories" action when there is no applicable advisories ', () => {
            const testRow = { applicable_advisories: [0, 0, 0, 0] };
            const actions = systemsRowActions(null, null, null, testRow);
            expect(actions).toEqual(
                [{ isDisabled: true, onClick: expect.any(Function), title: 'Apply all applicable advisories' }]
            );
        });
    });
});


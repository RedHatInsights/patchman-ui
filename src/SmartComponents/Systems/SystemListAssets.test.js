import {
  SYSTEMS_LIST_COLUMNS,
  PACKAGE_SYSTEMS_COLUMNS,
  systemsRowActions,
  useActivateRemediationModal,
} from './SystemsListAssets';
import {
  createAdvisoriesIcons,
  createUpgradableColumn,
  remediationProvider,
} from '../../Utilities/Helpers';
import { fetchApplicableSystemAdvisoriesApi } from '../../Utilities/api';
import { remediationIdentifiers } from '../../Utilities/constants';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('../../Utilities/Helpers', () => ({
  ...jest.requireActual('../../Utilities/Helpers'),
  createAdvisoriesIcons: jest.fn(),
  createUpgradableColumn: jest.fn(),
  remediationProvider: jest.fn(),
}));
jest.mock('../../Utilities/api', () => ({
  ...jest.requireActual('../../Utilities/api'),
  fetchApplicableSystemAdvisoriesApi: jest.fn(),
}));

describe('SystemListAssets.js', () => {
  it('Should call systemsListColumns on Applicable advisories renderFunc with correct params', () => {
    SYSTEMS_LIST_COLUMNS.find((c) => c.key === 'applicable_advisories').renderFunc('testValue');
    expect(createAdvisoriesIcons).toHaveBeenCalledWith('testValue', 'installable');
  });

  it('Should call createUpgradableColumn on Status renderFunc with correct params', () => {
    PACKAGE_SYSTEMS_COLUMNS.find((c) => c.key === 'update_status').renderFunc('testValue');
    expect(createUpgradableColumn).toHaveBeenCalledWith('testValue');
  });

  describe('test systemsRowActions: ', () => {
    const getMockedData = (id) => Promise.resolve({ data: [{ id }], meta: { total_items: 51 } });
    fetchApplicableSystemAdvisoriesApi
      .mockReturnValueOnce(getMockedData('testDataID-1'))
      .mockReturnValueOnce(getMockedData('testDataID-2'))
      .mockReturnValue(getMockedData('testDataID-3'));

    const mockShowRemediationModal = jest.fn();
    const mockSetRemediationCmp = jest.fn();
    const { result } = renderHook(() =>
      useActivateRemediationModal(mockSetRemediationCmp, mockShowRemediationModal),
    );
    const actions = systemsRowActions(result.current);
    actions[0].onClick(null, null, { id: 'testId' });

    it('Should enable remediation modal', async () => {
      await waitFor(() => {
        expect(mockShowRemediationModal).toHaveBeenCalledWith(true);
      });
    });
    it('Should fetch only Installable advisories from fetchApplicableSystemAdvisoriesApi', () => {
      expect(fetchApplicableSystemAdvisoriesApi).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'testId',
          'filter[status]': 'in:Installable',
        }),
      );
      expect(fetchApplicableSystemAdvisoriesApi).toHaveBeenCalledTimes(3);
    });
    it('Should call remediationProvider with fetched advisories data', () => {
      expect(remediationProvider).toHaveBeenCalledWith(
        ['testDataID-2', 'testDataID-3'],
        'testId',
        remediationIdentifiers.advisory,
      );
    });
    it('Should disable "Apply all applicable advisories" action when there is no applicable advisories ', () => {
      const testRow = { applicable_advisories: [0, 0, 0, 0] };
      const actions = systemsRowActions(null, null, null, testRow);
      expect(actions).toEqual([
        {
          isDisabled: true,
          onClick: expect.any(Function),
          title: 'Apply all applicable advisories',
        },
      ]);
    });
  });
});

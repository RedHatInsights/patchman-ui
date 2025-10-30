import configureStore from 'redux-mock-store';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import PackageSystems from './PackageSystems';
import { ComponentWithContext } from '../../Utilities/TestingUtilities.js';
import { render, screen } from '@testing-library/react';

initMocks();

jest.mock('@redhat-cloud-services/frontend-components-utilities/helpers', () => ({
  ...jest.requireActual('@redhat-cloud-services/frontend-components-utilities/helpers'),
  downloadFile: jest.fn(),
}));

jest.mock('../../PresentationalComponents/Filters/OsVersionFilter');

jest.mock('../../Utilities/api', () => ({
  ...jest.requireActual('../../Utilities/api'),
  exportPackageSystemsCSV: jest.fn(() =>
    Promise.resolve({ success: true }).catch((err) => console.log(err)),
  ),
  exportPackageSystemsJSON: jest.fn(() =>
    Promise.resolve({ success: true }).catch((err) => console.log(err)),
  ),
  fetchPackageVersions: jest.fn(() =>
    Promise.resolve({ success: true }).catch((err) => console.log(err)),
  ),
  fetchIDs: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          advisory_type: 2,
          description: 'The tzdata penhancements.',
          public_date: '2020-10-19T15:02:38Z',
          synopsis: 'tzdata enhancement update',
          updatable: true,
          id: 'RHBA-2020:4282',
          type: 'advisory',
        },
      ],
    }).catch((err) => console.log(err)),
  ),
}));

const mockState = {
  entities: {
    rows: systemRows,
    metadata: {
      limit: 25,
      offset: 0,
      total_items: 10,
    },
    expandedRows: {},
    selectedRows: { 'test-system-1': 'packageEvra' },
    error: {},
    status: 'resolved',
    total: 101,
  },
  PackageSystemsStore: {
    queryParams: {},
  },
};

const initStore = () => {
  const mockStore = configureStore([]);
  return mockStore(mockState);
};

const store = initStore(mockState);

beforeEach(() => {
  render(
    <ComponentWithContext renderOptions={{ store }}>
      <PackageSystems packageName='testName' />
    </ComponentWithContext>,
  );
});

// TODO: find a meaningful way of testing InventoryTable fed module
describe('PackageSystems.js', () => {
  it('Should render inventory table', () => {
    expect(screen.getByTestId('inventory-mock-component')).toBeVisible();
  });
  // it('Should dispatch change package systems params  action once only', () => {
  //     const dispatchedActions = store.getActions();
  //     expect(dispatchedActions.filter(item => item.type === 'CHANGE_PACKAGE_SYSTEMS_PARAMS')).toHaveLength(1);
  // });

  // it('Should open remediation modal', () => {
  //     const { dedicatedAction } = wrapper.find('.testInventroyComponentChild').parent().props();
  //     const remediationPairs = dedicatedAction.props.remediationProvider('test-system-1');
  //     expect(remediationPairs).toEqual({
  //         issues: [
  //             {
  //                 id: 'patch-package:testName-packageEvra',
  //                 description: 'testName-packageEvra',
  //                 systems: ['test-system-1']
  //             }
  //         ]
  //     });
  //     expect(dedicatedAction).toMatchSnapshot();
  // });

  // describe('test exports', () => {

  //     global.Headers = jest.fn();
  //     global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

  //     it('Should download csv file', () => {
  //         const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
  //         exportConfig.onSelect(null, 'csv');
  //         expect(exportPackageSystemsCSV).toHaveBeenCalledWith({}, 'testName');
  //     });

  //     it('Should download json file', () => {
  //         const { exportConfig } = wrapper.find('.testInventroyComponentChild').parent().props();
  //         exportConfig.onSelect(null, 'json');
  //         expect(exportPackageSystemsJSON).toHaveBeenCalledWith({}, 'testName');
  //     });
  // });

  // describe('test entity selecting', () => {
  //     it('Should unselect all', () => {
  //         const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

  //         bulkSelect.items[0].onClick();
  //         const dispatchedActions = store.getActions();

  //         expect(dispatchedActions[1].type).toEqual('SELECT_ENTITY');
  //         expect(bulkSelect.items[0].title).toEqual('Select none (0)');
  //         expect(dispatchedActions[1].payload).toEqual([{ id: 'test-system-1', selected: false }]);
  //     });

  //     it('Should select a page', async () => {

  //         const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

  //         bulkSelect.items[1].onClick();
  //         const dispatchedActions = store.getActions();
  //         expect(dispatchedActions[1].type).toEqual('SELECT_ENTITY');
  //         expect(bulkSelect.items[1].title).toEqual('Select page (2)');
  //     });

  //     it('Should select all', async () => {

  //         const { bulkSelect } = wrapper.find('.testInventroyComponentChild').parent().props();

  //         bulkSelect.items[2].onClick();
  //         expect(fetchIDs).toHaveBeenCalledWith('/packages/testName/systems', { limit: -1, offset: 0 });
  //         expect(bulkSelect.items[2].title).toEqual('Select all (2)');
  //     });
  // });
});

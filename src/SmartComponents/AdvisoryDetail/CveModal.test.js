import configureStore from 'redux-mock-store';
import { storeListDefaults } from '../../Utilities/constants';
import { cveRows, readyCveRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import CvesModal from './CvesModal';
import { createCvesRows } from '../../Utilities/DataMappers';
import { render, screen, waitFor } from '@testing-library/react';
import { ComponentWithContext } from '../../Utilities/TestingUtilities.js';

initMocks();

jest.mock('../../Utilities/DataMappers', () => ({
  ...jest.requireActual('../../Utilities/DataMappers'),
  createCvesRows: jest.fn(),
}));

jest.mock('../../Utilities/api', () => ({
  ...jest.requireActual('../../Utilities/api'),
  fetchCvesInfo: jest.fn(() => Promise.resolve('success').catch((err) => console.log(err))),
}));

const mockState = { ...storeListDefaults, rows: cveRows };

const initStore = (state) => {
  const mockStore = configureStore([]);
  return mockStore({ CvesListStore: state });
};

let store = initStore(mockState);

beforeEach(() => {
  createCvesRows.mockImplementation(() => readyCveRows);

  render(
    <ComponentWithContext renderOptions={{ store }}>
      <CvesModal />
    </ComponentWithContext>,
  );
});

// TODO: convert disabled tests to RTL after react&paterrnfly migration
describe('CveModal.js', () => {
  it('should render the CVEs modal', async () => {
    await waitFor(() => screen.getByText('CVEs'));
  });
  // it('should set rows to undefined to close the modal', () => {
  //     screen.debug(undefined, 30000);
  //     // const handleClose = wrapper.find('Modal').props().onClose;
  //     // handleClose();
  //     // wrapper.update();
  //     // expect(wrapper.find('TableView').exists()).toBeFalsy();
  // });

  // it('should handle page change', () => {
  //     let tempWrapper;
  //     tempWrapper = mount(
  //         <Provider store={store}>
  //             <Router><CvesModal cveIds={['testCveID']} /></Router>
  //         </Provider>
  //     );

  //     const handlePageChange = tempWrapper.find('TableView').props().onSetPage;
  //     act(() => handlePageChange('', 2));
  //     act(() => tempWrapper.update());
  //     expect(tempWrapper.find('TableView').props().store.rows).toEqual(
  //         [{ cells: [{ title: '[Object] ' }, { title: '[Object]', value: 'Moderate' },
  //             { title: '7.3' }], id: 'CVE-2021-29931', key: 'CVE-2021-29931' },
  //         { cells: [{ title: '[Object] ' }, { title: '[Object]', value: 'Moderate' },
  //             { title: '7.3' }], id: 'CVE-2021-29932', key: 'CVE-2021-29932' }]
  //     );
  // });

  // it('should handle perPage change', () => {
  //     let tempWrapper;
  //     tempWrapper = mount(
  //         <Provider store={store}>
  //             <Router><CvesModal /></Router>
  //         </Provider>
  //     );

  //     const handlePerPageChange = tempWrapper.find('TableView').props().onPerPageSelect;
  //     act(() => handlePerPageChange('', 20));
  //     act(() => tempWrapper.update());
  //     expect(tempWrapper.find('TableView').props().store.rows).toEqual(readyCveRows);
  // });

  // it('should handle sorting', () => {
  //     let tempWrapper;
  //     tempWrapper = mount(
  //         <Provider store={store}>
  //             <Router><CvesModal /></Router>
  //         </Provider>);

  //     const handleSort = tempWrapper.find('TableView').props().onSort;
  //     act(() => handleSort('', 0, 'desc'));
  //     act(() => tempWrapper.update());

  //     expect(tempWrapper.find('TableView').props().store.rows).
  //     toEqual(readyCveRows.slice(0, 10).sort(({ id: aId }, { id: bId }) =>  {
  //         return !aId.localeCompare(bId);
  //     }));
  // });
});

import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { storeListDefaults } from '../../Utilities/constants';
import { cveRows, readyCveRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import CvesModal from './CvesModal';
import toJson from 'enzyme-to-json';
import { createCvesRows } from '../../Utilities/DataMappers';
import { act } from 'react-dom/test-utils';

initMocks();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('../../Utilities/DataMappers', () => ({
    ...jest.requireActual('../../Utilities/DataMappers'),
    createCvesRows: jest.fn()
}));

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    fetchCvesInfo: jest.fn(() => Promise.resolve('success').catch((err) => console.log(err)))
}));

const mockState = { ...storeListDefaults, rows: cveRows };

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ CvesListStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ CvesListStore: state });
};

let wrapper;
let tempWrapper;
let store = initStore(mockState);

beforeEach(() => {
    wrapper = undefined;
    tempWrapper = undefined;
    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ CvesListStore: mockState });
    });
    createCvesRows.mockImplementation(() => readyCveRows);

    wrapper = mount(<Provider store={store}>
        <Router><CvesModal cveIds={['testCveID']}  /></Router>
    </Provider>);
    tempWrapper = mount(
        <Provider store={store}>
            <Router><CvesModal /></Router>
        </Provider>
    );
});

afterEach(() => {
    useSelector.mockClear();
    wrapper.unmount();
    tempWrapper.unmount();
});

describe('CveModal.js', () => {
    it('Should match the snapshots', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.unmount();
    });

    it('should handle search filter', () => {
        const handleFilter = wrapper.find('TableView').props().apply;
        handleFilter({ search: 'CVE-2021-29922' });
        expect(createCvesRows.mock.calls[2][0]).toEqual([cveRows[1]]);
        wrapper.unmount();
    });

    it('should set rows to undefined to close the modal', () => {
        const handleClose = wrapper.find('Modal').props().onClose;
        handleClose();
        wrapper.update();
        expect(wrapper.find('TableView').exists()).toBeFalsy();
        wrapper.unmount();
    });

    it('should handle page change', () => {

        const handlePageChange = tempWrapper.find('TableView').props().onSetPage;
        act(() => handlePageChange('', 2));
        act(() => tempWrapper.update());
        expect(tempWrapper.find('TableView').props().store.rows).toEqual(
            [{ cells: [{ title: '[Object] ' }, { title: '[Object]', value: 'Moderate' },
                { title: '7.3' }], id: 'CVE-2021-29931', key: 'CVE-2021-29931' },
            { cells: [{ title: '[Object] ' }, { title: '[Object]', value: 'Moderate' },
                { title: '7.3' }], id: 'CVE-2021-29932', key: 'CVE-2021-29932' }]
        );
        tempWrapper.unmount();
    });

    it('should handle perPage change', () => {

        const handlePerPageChange = tempWrapper.find('TableView').props().onPerPageSelect;
        act(() => handlePerPageChange('', 20));
        act(() => tempWrapper.update());
        expect(tempWrapper.find('TableView').props().store.rows).toEqual(readyCveRows);
        tempWrapper.unmount();
    });

    it('should handle sorting', () => {

        const handleSort = tempWrapper.find('TableView').props().onSort;
        act(() => handleSort('', 0, 'desc'));
        act(() => tempWrapper.update());

        expect(tempWrapper.find('TableView').props().store.rows).
        toEqual(readyCveRows.slice(0, 10).sort(({ id: aId }, { id: bId }) =>  {
            return !aId.localeCompare(bId);
        }));
        tempWrapper.unmount();
    });
});

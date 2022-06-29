import InventoryDetail from './InventoryDetail';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import { entityDetail } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks, mountWithIntl } from '../../Utilities/unitTestingUtilities.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { InventoryDetailHead } from '@redhat-cloud-services/frontend-components/Inventory';
import UnassignSystemsModal from '../Modals/UnassignSystemsModal';

initMocks();

jest.mock('../../Utilities/Hooks', () => ({
    ...jest.requireActual('../../Utilities/Hooks'),
    useFeatureFlag: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    ...jest.requireActual('@redhat-cloud-services/frontend-components/Inventory'),
    InventoryTable: jest.fn(() => <div className='testInventroyComponent'><div>This is child</div></div>),
    InventoryDetailHead: jest.fn(() => <div className='testInventoryDetailHead'><div>This is child</div></div>),
    AppInfo: jest.fn(() => <div className='testInventroyAppInfo'><div>This is child</div></div>),
    DetailWrapper: jest.fn(({ children }) => <div className='testDetailWrapper'><div>{children}</div></div>)
}));

const mockState = { ...entityDetail };

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({  entityDetails: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({  entityDetails: state });
};

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => {};

    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ entityDetails: mockState });
    });
    wrapper = mountWithIntl(<Provider store={store}>
        <Router><InventoryDetail match = {{ params: { inventoryId: 'test' } }}/></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('InventoryPage.js', () => {
    it('Should match the snapshots', () => {
        expect(toJson(wrapper.update())).toMatchSnapshot();
    });

    it('Should display "Remove from patch set" action in disabled state', () => {
        const { actions } = wrapper.find(InventoryDetailHead).props();

        expect(actions).toEqual(
            [
                { key: 'assign-to-patch-set', onClick: expect.any(Function), title: 'Assign to a patch set' },
                { isDisabled: true, key: 'remove-from-patch-set', onClick: expect.any(Function), title: 'Remove from patch set' }
            ]);
    });

    it('Should display "Remove from patch set" action in enabled state', () => {
        useSelector.mockImplementation(callback => {
            return callback({ entityDetails: { ...mockState, patchSetName: 'test-name' } });
        });
        const tempWrapper = mount(<Provider store={store}>
            <Router><InventoryDetail match={{ params: { inventoryId: 'test' } }} /></Router>
        </Provider>);
        const { actions } = tempWrapper.find(InventoryDetailHead).props();

        expect(actions).toEqual([
            { key: 'assign-to-patch-set', onClick: expect.any(Function), title: 'Assign to a patch set' },
            { isDisabled: false, key: 'remove-from-patch-set', onClick: expect.any(Function), title: 'Remove from patch set' }
        ]);
    });

    it('Should open UnassignSystemsModal when "Remove from patch set" action is called', () => {
        const testID = 'test-system-id';
        useSelector.mockImplementation(callback => {
            return callback({ entityDetails: { ...mockState, patchSetName: 'test-name' } });
        });
        const tempWrapper = mountWithIntl(<Provider store={store}>
            <Router><InventoryDetail match={{ params: { inventoryId: testID } }} /></Router>
        </Provider>);
        const { actions } = tempWrapper.find(InventoryDetailHead).props();
        actions.find(action => action.key === 'remove-from-patch-set')?.onClick();

        const unassignSystemsModalState = tempWrapper.update().find(UnassignSystemsModal).props().unassignSystemsModalState;
        expect(unassignSystemsModalState).toEqual({
            systemsIDs: [testID], isUnassignSystemsModalOpen: true, shouldRefresh: false
        });
    });

    it('Should refresh the page after successful system removal from patch set', async () => {
        const { actions } = wrapper.find(InventoryDetailHead).props();
        actions.find(action => action.key === 'remove-from-patch-set')?.onClick();

        const setUnassignSystemsModalOpen = wrapper.update().find(UnassignSystemsModal).props().setUnassignSystemsModalOpen;
        await act(async () => {
            setUnassignSystemsModalOpen({
                isUnassignSystemsModalOpen: false,
                systemsIDs: [],
                shouldRefresh: true
            });
        });

        expect(store.getActions().filter(action => action.type === 'FETCH_SYSTEM_DETAIL').length).toEqual(2);
    });
});


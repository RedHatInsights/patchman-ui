import InventoryDetail from './InventoryDetail';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { entityDetail } from '../../Utilities/RawDataForTesting';
import configureStore from 'redux-mock-store';
import { initMocks, mountWithIntl } from '../../Utilities/unitTestingUtilities.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { InventoryDetailHead } from '@redhat-cloud-services/frontend-components/Inventory';
import UnassignSystemsModal from '../Modals/UnassignSystemsModal';
import { useFeatureFlag } from '../../Utilities/hooks';

initMocks();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        inventoryId: 'test-system-id'
    }),
    useRouteMatch: () => ({ url: '/systems/test-system-id' })
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    InventoryDetailHead: jest.fn(() => <div className='testInventoryDetailHead'><div>This is child</div></div>),
    DetailWrapper: jest.fn(({ children }) => <div className='testDetailWrapper'><div>{children}</div></div>)
}));
jest.mock('./SystemDetail', () => () => <div>This is system detail</div>);

const mockState = { ...entityDetail, SystemDetailStore: {} };

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ entityDetails: state, SystemDetailStore: state  });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ entityDetails: state, SystemDetailStore: state });
};

let wrapper;
let store = initStore(mockState);

beforeEach(() => {
    console.error = () => {};

    store.clearActions();
    useSelector.mockImplementation(callback => {
        return callback({ entityDetails: mockState, SystemDetailStore: {} });
    });
    wrapper = mountWithIntl(<Provider store={store}>
        <Router><InventoryDetail /></Router>
    </Provider>);
});

afterEach(() => {
    useSelector.mockClear();
});

describe('InventoryPage.js', () => {
    it('Should match the snapshots', () => {
        const { asFragment } = render(
            <Provider store={store}>
                <Router><InventoryDetail /></Router>
            </Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('Should display "Remove from a template" action in disabled state', () => {
        const { actions } = wrapper.find(InventoryDetailHead).props();

        expect(actions).toEqual(
            [
                { key: 'assign-to-template', onClick: expect.any(Function), title: 'Assign to a template' },
                { isDisabled: true, key: 'remove-from-template', onClick: expect.any(Function), title: 'Remove from a template' }
            ]);
    });

    it('Should display "Remove from a template" action in enabled state', () => {
        useSelector.mockImplementation(callback => {
            return callback({
                entityDetails: { ...mockState, patchSetName: 'test-name' },
                SystemDetailStore: { patchSetName: 'template-name' }
            });
        });
        const tempWrapper = mount(<Provider store={store}>
            <Router><InventoryDetail /></Router>
        </Provider>);
        const { actions } = tempWrapper.find(InventoryDetailHead).props();

        expect(actions).toEqual([
            { key: 'assign-to-template', onClick: expect.any(Function), title: 'Assign to a template' },
            { isDisabled: false, key: 'remove-from-template', onClick: expect.any(Function), title: 'Remove from a template' }
        ]);
    });

    it('Should open UnassignSystemsModal when "Remove from a template" action is called', () => {
        const testID = 'test-system-id';
        useSelector.mockImplementation(callback => {
            return callback({ entityDetails: { ...mockState, patchSetName: 'test-name' }, SystemDetailStore: {} });
        });
        const tempWrapper = mountWithIntl(<Provider store={store}>
            <Router><InventoryDetail  /></Router>
        </Provider>);
        const { actions } = tempWrapper.find(InventoryDetailHead).props();
        actions.find(action => action.key === 'remove-from-template')?.onClick();

        const unassignSystemsModalState = tempWrapper.update().find(UnassignSystemsModal).props().unassignSystemsModalState;
        expect(unassignSystemsModalState).toEqual({
            systemsIDs: [testID], isUnassignSystemsModalOpen: true, shouldRefresh: false
        });
    });

    it('Should refresh the page after successful system removal from a template', async () => {
        const { actions } = wrapper.find(InventoryDetailHead).props();
        actions.find(action => action.key === 'remove-from-template')?.onClick();

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

    it('Should hide all dropdown actions when patch template flag is disabled', () => {
        useFeatureFlag.mockReturnValueOnce(false);
        const tempWrapper = mountWithIntl(<Provider store={store}>
            <Router><InventoryDetail  /></Router>
        </Provider>);

        const { actions } = tempWrapper.find(InventoryDetailHead).props();
        expect(actions.length).toEqual(undefined);
    });
});

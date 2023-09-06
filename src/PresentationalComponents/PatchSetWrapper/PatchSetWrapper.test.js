import PatchSetWrapper from './PatchSetWrapper';
import PatchSetWizard from '../../SmartComponents/PatchSetWizard/PatchSetWizard';
import UnassignSystemsModal from '../../SmartComponents/Modals/UnassignSystemsModal';
import { mountWithIntl } from '../../Utilities/unitTestingUtilities';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('../../SmartComponents/PatchSetWizard/PatchSetWizard', () => () => <div id={'test-patch-set-wizard'}></div>);
jest.mock('../../SmartComponents/Modals/UnassignSystemsModal', () => () => <div id={'test-unassign-systems-modal'}></div>);

const mockState = {};

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ SpecificPatchSetReducer: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ });
};

let store = initStore(mockState);

const testProps = {
    patchSetState: {
        isUnassignSystemsModalOpen: true,
        isPatchSetWizardOpen: true,
        systemsIDs: ['system-1', 'system-2']
    },
    setPatchSetState: jest.fn()
};
describe('PatchSetWrapper', () => {
    it('should display PatchSetWizard when isPatchSetWizardOpen prop is true', () => {
        const wrapper = mountWithIntl(<Provider store={store}><PatchSetWrapper {...testProps} /></Provider>);
        expect(wrapper.find(PatchSetWizard).exists()).toBeTruthy();
        wrapper.unmount();
    });
    it('should hide PatchSetWizard when isPatchSetWizardOpen prop is false', () => {
        const testHiddenState = {
            patchSetState: { ...testProps.patchSetState, isPatchSetWizardOpen: false },
            ...testProps.setPatchSetState
        };
        const wrapper = mountWithIntl(<Provider store={store}><PatchSetWrapper {...testHiddenState} /></Provider>);
        expect(wrapper.find(PatchSetWizard).exists()).toBeFalsy();
        wrapper.unmount();
    });
    it('should display UnassignSystemsModal when isUnassignSystemsModalOpen prop is true', () => {
        const wrapper = mountWithIntl(<Provider store={store}><PatchSetWrapper {...testProps} /></Provider>);
        expect(wrapper.find(UnassignSystemsModal).exists()).toBeTruthy();
        wrapper.unmount();
    });
    it('should display UnassignSystemsModal when isUnassignSystemsModalOpen prop is false', () => {
        const testHiddenState = {
            patchSetState: { ...testProps.patchSetState, isUnassignSystemsModalOpen: false },
            ...testProps.setPatchSetState
        };
        const wrapper = mountWithIntl(<Provider store={store}><PatchSetWrapper {...testHiddenState} /></Provider>);
        expect(wrapper.find(UnassignSystemsModal).exists()).toBeFalsy();
        wrapper.unmount();
    });
    it('should props propagate to child components', () => {
        const wrapper = mountWithIntl(<Provider store={store}><PatchSetWrapper {...testProps} /></Provider>);
        const unassignSystemsModalProps = wrapper.find(UnassignSystemsModal).props();
        const patchSetWizardProps = wrapper.find(PatchSetWizard).props();

        expect(unassignSystemsModalProps).toEqual(
            {
                setUnassignSystemsModalOpen: testProps.setPatchSetState,
                systemsIDs: [
                    'system-1',
                    'system-2'
                ],
                unassignSystemsModalState: {
                    isPatchSetWizardOpen: true,
                    isUnassignSystemsModalOpen: true,
                    systemsIDs: ['system-1', 'system-2']
                }
            });
        wrapper.unmount();
        expect(patchSetWizardProps).toEqual({
            setBaselineState: testProps.setPatchSetState, systemsIDs: [
                'system-1',
                'system-2'
            ]
        });
        wrapper.unmount();
    });
});

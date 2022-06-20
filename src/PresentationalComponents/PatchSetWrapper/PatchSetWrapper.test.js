import PatchSetWrapper from './PatchSetWrapper';
import PatchSetWizard from '../../SmartComponents/PatchSetWizard/PatchSetWizard';
import UnassignSystemsModal from '../../SmartComponents/Modals/UnassignSystemsModal';
import { mountWithIntl } from '../../Utilities/unitTestingUtilities';

jest.mock('../../SmartComponents/PatchSetWizard/PatchSetWizard', () => () => <div id={'test-patch-set-wizard'}></div>);
jest.mock('../../SmartComponents/Modals/UnassignSystemsModal', () => () => <div id={'test-unassign-systems-modal'}></div>);

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
        const wrapper = mountWithIntl(<PatchSetWrapper {...testProps} />);
        expect(wrapper.find(PatchSetWizard).exists()).toBeTruthy();
    });
    it('should hide PatchSetWizard when isPatchSetWizardOpen prop is false', () => {
        const testHiddenState = {
            patchSetState: { ...testProps.patchSetState, isPatchSetWizardOpen: false },
            ...testProps.setPatchSetState
        };
        const wrapper = mountWithIntl(<PatchSetWrapper {...testHiddenState} />);
        expect(wrapper.find(PatchSetWizard).exists()).toBeFalsy();
    });
    it('should display UnassignSystemsModal when isUnassignSystemsModalOpen prop is true', () => {
        const wrapper = mountWithIntl(<PatchSetWrapper {...testProps} />);
        expect(wrapper.find(UnassignSystemsModal).exists()).toBeTruthy();
    });
    it('should display UnassignSystemsModal when isUnassignSystemsModalOpen prop is false', () => {
        const testHiddenState = {
            patchSetState: { ...testProps.patchSetState, isUnassignSystemsModalOpen: false },
            ...testProps.setPatchSetState
        };
        const wrapper = mountWithIntl(<PatchSetWrapper {...testHiddenState} />);
        expect(wrapper.find(UnassignSystemsModal).exists()).toBeFalsy();
    });
    it('should props propagate to child components', () => {
        const wrapper = mountWithIntl(<PatchSetWrapper {...testProps} />);
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
        expect(patchSetWizardProps).toEqual({
            setBaselineState: testProps.setPatchSetState, systemsIDs: [
                'system-1',
                'system-2'
            ]
        });
    });
});

import { act } from 'react-dom/test-utils';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import UnassignSystemsModal from './UnassignSystemsModal';
import { unassignSystemFromPatchSet, fetchSystems } from '../../Utilities/api';
import { mountWithIntl, initMocks } from '../../Utilities/unitTestingUtilities';
import { patchSetUnassignSystemsNotifications } from '../PatchSet/PatchSetAssets';
import { render } from '@testing-library/react';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../../../locales/en.json';

initMocks();

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    unassignSystemFromPatchSet: jest.fn(),
    fetchSystems: jest.fn()
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(() => () => {})
}));

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux', () => ({
    addNotification: jest.fn(() => {})
}));

fetchSystems.mockResolvedValue({ data: [{ id: 'test_1' }] });

describe('UnassignSystemsModal', () => {
    let unassignSystemsModalState = {
        isUnassignSystemsModalOpen: true,
        systemsIDs: ['test_1', 'test_2', 'test_3']
    };
    const setUnassignSystemsModalOpen = (modalState) => {
        unassignSystemsModalState = modalState;
    };

    const wrapper = mountWithIntl(<UnassignSystemsModal
        unassignSystemsModalState={unassignSystemsModalState}
        setUnassignSystemsModalOpen={setUnassignSystemsModalOpen}
    />
    );

    it('should match the snapshots', () => {
        const { asFragment } = render(
            <IntlProvider locale={navigator.language.slice(0, 2)} messages={messages}>
                <UnassignSystemsModal
                    unassignSystemsModalState={unassignSystemsModalState}
                    setUnassignSystemsModalOpen={setUnassignSystemsModalOpen}
                />
            </IntlProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('Should remove systems from a patch set and handle success notification', async ()  => {
        unassignSystemsModalState.isUnassignSystemsModalOpen = true;
        unassignSystemFromPatchSet.mockReturnValueOnce(
            new Promise((resolve) => {
                resolve({ status: 200 });
            })
        );

        await wrapper.update().find(Modal).props().actions[0].props.onClick();
        expect(addNotification).toHaveBeenCalledWith(
            patchSetUnassignSystemsNotifications(1).success
        );
        expect(unassignSystemsModalState).toEqual({ isUnassignSystemsModalOpen: false, shouldRefresh: true, systemsIDs: [] });
        expect(unassignSystemFromPatchSet).toHaveBeenCalledWith({ inventory_ids: ['test_1'] });
        wrapper.unmount();
    });

    it('should close the modal', () => {
        unassignSystemsModalState.isUnassignSystemsModalOpen = true;
        act(() => {
            wrapper.props().setUnassignSystemsModalOpen(false);
        });

        wrapper.update();
        expect(unassignSystemsModalState.isUnassignSystemsModalOpen).toBeFalsy();
        wrapper.unmount();
    });

    it('should hide the modal when isUnassignSystemsModalOpen=false', () => {
        const wrapper = mountWithIntl(<UnassignSystemsModal
            unassignSystemsModalState={{
                isUnassignSystemsModalOpen: false,
                systemsIDs: ['test_1', 'test_2', 'test_3']
            }}
            setUnassignSystemsModalOpen={setUnassignSystemsModalOpen}
        />
        );

        expect(wrapper.find(Modal).props().isOpen).toBeFalsy();
        wrapper.unmount();
    });
});

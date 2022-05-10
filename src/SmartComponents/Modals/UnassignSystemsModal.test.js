import toJson from 'enzyme-to-json';
import { act } from 'react-dom/test-utils';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import UnassignSystemsModal from './UnassignSystemsModal';
import { removePatchSetApi } from '../../Utilities/api';
import { patchSetUnassignSystemsNotifications } from '../../Utilities/constants';

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    removePatchSetApi: jest.fn()
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(() => () => {})
}));

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux', () => ({
    addNotification: jest.fn(() => {})
}));

describe('UnassignSystemsModal', () => {
    let unassignSystemsModalState = {
        isUnassignSystemsModalOpen: true,
        systemsIDs: ['test_1', 'test_2', 'test_3']
    };
    const setUnassignSystemsModalOpen = (modalState) => {
        unassignSystemsModalState = modalState;
    };

    const wrapper = mount(<UnassignSystemsModal
        unassignSystemsModalState={unassignSystemsModalState}
        setUnassignSystemsModalOpen={setUnassignSystemsModalOpen}
    />
    );

    it('should match the snapshots', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should remove systems from a patch set and handle success notification', async ()  => {
        unassignSystemsModalState.isUnassignSystemsModalOpen = true;
        removePatchSetApi.mockReturnValueOnce(
            new Promise((resolve) => {
                resolve({ status: 200 });
            }
            )
        );
        await wrapper.find(Modal).props().actions[0].props.onClick();
        expect(addNotification).toHaveBeenCalledWith(
            patchSetUnassignSystemsNotifications(3).success
        );
        expect(unassignSystemsModalState.isUnassignSystemsModalOpen).toBeFalsy();
    });

    it('should close the modal', () => {
        unassignSystemsModalState.isUnassignSystemsModalOpen = true;
        act(() => {
            wrapper.props().setUnassignSystemsModalOpen(false);
        });

        wrapper.update();
        expect(unassignSystemsModalState.isUnassignSystemsModalOpen).toBeFalsy();
    });

    it('should hide the modal when isUnassignSystemsModalOpen=false', () => {
        const wrapper = mount(<UnassignSystemsModal
            systemsIDs={unassignSystemsModalState.systemsIDs}
            isUnassignSystemsModalOpen={false}
            setUnassignSystemsModalOpen={setUnassignSystemsModalOpen}
        />
        );

        expect(wrapper.find(Modal).props().isOpen).toBeFalsy();
    });
});

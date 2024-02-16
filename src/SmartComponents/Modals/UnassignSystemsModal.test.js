import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import UnassignSystemsModal from './UnassignSystemsModal';
import { unassignSystemFromPatchSet, fetchSystems } from '../../Utilities/api';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import { patchSetUnassignSystemsNotifications } from '../PatchSet/PatchSetAssets';
import { render, waitFor, screen } from '@testing-library/react';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import userEvent from '@testing-library/user-event';

initMocks();

jest.mock('../../Utilities/api', () => ({
    ...jest.requireActual('../../Utilities/api'),
    unassignSystemFromPatchSet: jest.fn(),
    fetchIDs: jest.fn(() => Promise.resolve({ data: [{ id: 'test_1' }] }))
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(() => () => {})
}));

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux', () => ({
    addNotification: jest.fn(() => {})
}));

fetchSystems.mockResolvedValue({ data: [{ id: 'test_1' }] });

let unassignSystemsModalState = {
    isUnassignSystemsModalOpen: true,
    systemsIDs: ['test_1', 'test_2', 'test_3']
};
const setUnassignSystemsModalOpen = (modalState) => {
    unassignSystemsModalState = modalState;
};

beforeEach(() => {
    unassignSystemsModalState.isUnassignSystemsModalOpen = true;
    render(
        <IntlProvider>
            <UnassignSystemsModal
                unassignSystemsModalState={unassignSystemsModalState}
                setUnassignSystemsModalOpen={setUnassignSystemsModalOpen}
            />
        </IntlProvider>
    );
});

const user = userEvent.setup();

describe('UnassignSystemsModal', () => {
    it('Should remove systems from a patch set and handle success notification', async ()  => {
        unassignSystemsModalState.isUnassignSystemsModalOpen = true;
        unassignSystemFromPatchSet.mockReturnValueOnce(
            new Promise((resolve) => {
                resolve({ status: 200 });
            })
        );

        await user.click(screen.getByText('Remove'));

        await waitFor(() => {
            expect(addNotification).toHaveBeenCalledWith(
                patchSetUnassignSystemsNotifications(1).success
            );
            expect(unassignSystemsModalState).toEqual({ isUnassignSystemsModalOpen: false, shouldRefresh: true, systemsIDs: [] });
            expect(unassignSystemFromPatchSet).toHaveBeenCalledWith({ inventory_ids: ['test_1'] });
        });
    });

    it('should close the modal', async () => {
        unassignSystemsModalState.isUnassignSystemsModalOpen = true;
        await user.click(screen.getByLabelText('Close'));

        await waitFor(() => {
            expect(unassignSystemsModalState.isUnassignSystemsModalOpen).toBeFalsy();
        });
    });

    it('Should return correct notification text with 1 system', () => {
        const result = patchSetUnassignSystemsNotifications(1);
        expect(result.success).toEqual({
            title: `Systems succesfully removed from this Patch template.`,
            description: `1 system removed from Patch template(s)`,
            variant: 'success'
        });
    });

    it('Should return correct notification text with multiple systems', () => {
        const result = patchSetUnassignSystemsNotifications(2);
        expect(result.success).toEqual({
            title: `Systems succesfully removed from this Patch template.`,
            description: `2 systems removed from Patch template(s)`,
            variant: 'success'
        });
    });
});

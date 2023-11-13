import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import { unassignSystemFromPatchSet } from '../../Utilities/api';
import { patchSetUnassignSystemsNotifications } from '../PatchSet/PatchSetAssets';

/**
*Handles removing one or more systems from different patch sets.
* @param {Function} [handleModalToggle] function to close the modal on callback
* @param {Array} [systemsWithPatchSet] array of systems to be removed
* @returns {handleSystemsRemoval}
*/
export const useUnassignSystemsHook = (handleModalToggle, systemsWithPatchSet) => {
    const dispatch = useDispatch();
    const handleSystemsRemoval = async () => {
        const result = await unassignSystemFromPatchSet({ inventory_ids: systemsWithPatchSet });
        handleModalToggle(true);

        if (result.status === 200) {
            dispatch(
                addNotification(
                    patchSetUnassignSystemsNotifications(systemsWithPatchSet?.length || 0).success
                )
            );
        }
        else {
            dispatch(
                addNotification(
                    patchSetUnassignSystemsNotifications().failure
                )
            );
        }
    };

    return handleSystemsRemoval;
};

import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';

import { unassignSystemFromPatchSet } from '../../Utilities/api';
import { patchSetUnassignSystemsNotifications } from '../PatchSet/PatchSetAssets';

/**
 *Handles removing one or more systems from different patch sets.
 * @param {Function} [handleModalToggle] function to close the modal on callback
 * @param {Array} [systemsWithPatchSet] array of systems to be removed
 * @returns {handleSystemsRemoval}
 */
export const useUnassignSystemsHook = (handleModalToggle, systemsWithPatchSet) => {
  const addNotification = useAddNotification();

  const handleSystemsRemoval = async () => {
    const result = await unassignSystemFromPatchSet({ inventory_ids: systemsWithPatchSet });
    handleModalToggle(true);

    if (result.status === 200) {
      addNotification(
        patchSetUnassignSystemsNotifications(systemsWithPatchSet?.length || 0).success,
      );
    } else {
      addNotification(patchSetUnassignSystemsNotifications().failure);
    }
  };

  return handleSystemsRemoval;
};

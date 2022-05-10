import React from 'react';
import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Modal, Button } from '@patternfly/react-core';

import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { removePatchSetApi } from '../../Utilities/api';
import { patchSetUnassignSystemsNotifications } from '../../Utilities/constants';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const UnassignSystemsModal = ({ unassignSystemsModalState = {}, setUnassignSystemsModalOpen }) => {
    const dispatch = useDispatch();

    const { systemsIDs, isUnassignSystemsModalOpen } = unassignSystemsModalState;

    const handleModalOpen = () => {
        setUnassignSystemsModalOpen({
            isUnassignSystemsModalOpen: !isUnassignSystemsModalOpen,
            systemsIDs: []
        });
    };

    const handleUnassignment = async () => {
        const result = await removePatchSetApi(systemsIDs);

        //TODO: mockups do not have error notifications designed, add them if UX designes.
        if (result.status === 200) {
            handleModalOpen();
            dispatch(addNotification(patchSetUnassignSystemsNotifications(systemsIDs?.length || 0).success));
        }
    };

    return (
        <Modal
            variant={'small'}
            isOpen={unassignSystemsModalState.isUnassignSystemsModalOpen}
            title="Remove systems"
            onClose={handleModalOpen}
            titleIconVariant="warning"
            actions={[
                <Button key="confirm" variant="danger" onClick={handleUnassignment}>
                    {intl.formatMessage(messages.labelsRemove)}
                </Button>,
                <Button key="cancel" variant="link" onClick={handleModalOpen}>
                    {intl.formatMessage(messages.labelsCancel)}
                </Button>
            ]}
        >
            {intl.formatMessage(
                messages.textUnassignSystemsStatement,
                { systemIDs: <b>{systemsIDs ? systemsIDs.length : 0}</b> }
            )}
        </Modal>
    );
};

UnassignSystemsModal.propTypes = {
    setUnassignSystemsModalOpen: propTypes.func,
    unassignSystemsModalState: propTypes.object
};
export default UnassignSystemsModal;

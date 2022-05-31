import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Modal, Button, GridItem, Grid, Skeleton } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { injectIntl } from 'react-intl';

import messages from '../../Messages';
import { removePatchSetApi, fetchSystems } from '../../Utilities/api';
import { patchSetUnassignSystemsNotifications } from '../../Utilities/constants';

const UnassignSystemsModal = ({ unassignSystemsModalState = {}, setUnassignSystemsModalOpen, intl }) => {
    const dispatch = useDispatch();

    const { systemsIDs, isUnassignSystemsModalOpen } = unassignSystemsModalState;
    const [systemsWithPatchSet, setSystemWithPatchSet] = useState([]);
    const [systemsLoading, setSystemsLoading] = useState(true);

    const handleModalOpen = (shouldRefresh) => {
        setUnassignSystemsModalOpen({
            isUnassignSystemsModalOpen: !isUnassignSystemsModalOpen,
            systemsIDs: [],
            shouldRefresh
        });
    };

    const handleUnassignment = async () => {
        const result = await removePatchSetApi({ inventory_ids: systemsWithPatchSet });

        //TODO: mockups do not have error notifications designed, add them if UX designes.
        if (result.status === 200) {
            handleModalOpen(true);
            dispatch(addNotification(patchSetUnassignSystemsNotifications(systemsWithPatchSet?.length || 0).success));
        }
    };

    useEffect(() => {
        //filters out systems without patch sets assigned
        fetchSystems({ limit: -1, 'filter[baseline_name]': 'neq:' }).then((allSystemsWithPatchSet) => {
            setSystemWithPatchSet(
                systemsIDs.filter(systemID =>
                    allSystemsWithPatchSet?.data.some(system => system.id === systemID)
                )
            );

            setSystemsLoading(false);
        });
    }, [systemsIDs]);

    const systemsWithoutPatchSetCount = systemsIDs.length - systemsWithPatchSet.length;

    const modalMessage = (bodyMessage, systemsCount) => (<GridItem>
        {intl.formatMessage(
            messages[bodyMessage],
            { systemsCount, b: (...chunks) => <b>{chunks}</b> }
        )}
    </GridItem>);

    return (
        <Modal
            variant={'small'}
            isOpen={unassignSystemsModalState.isUnassignSystemsModalOpen}
            title={intl.formatMessage(messages.textUnassignSystemsTitle)}
            onClose={handleModalOpen}
            titleIconVariant="warning"
            actions={[
                <Button key="confirm" variant="danger" onClick={handleUnassignment} isDisabled={systemsWithPatchSet.length === 0}>
                    {intl.formatMessage(messages.labelsRemove)}
                </Button>,
                <Button key="cancel" variant="link" onClick={handleModalOpen}>
                    {intl.formatMessage(messages.labelsCancel)}
                </Button>
            ]}
        >
            <Grid container hasGutter>
                {systemsLoading && <Skeleton />}
                {(!systemsLoading && systemsWithPatchSet.length !== 0) &&
                    modalMessage('textUnassignSystemsStatement', systemsWithPatchSet.length)
                }
                {(!systemsLoading && systemsWithoutPatchSetCount > 0) &&
                    modalMessage('textUnassignSystemsWarning', systemsWithoutPatchSetCount)
                }
            </Grid>
        </Modal>
    );
};

UnassignSystemsModal.propTypes = {
    intl: propTypes.any,
    setUnassignSystemsModalOpen: propTypes.func,
    unassignSystemsModalState: propTypes.object
};
export default injectIntl(UnassignSystemsModal);

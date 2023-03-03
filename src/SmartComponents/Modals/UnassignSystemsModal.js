import React, { Fragment, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Modal, Button, Grid, Skeleton } from '@patternfly/react-core';
import { injectIntl } from 'react-intl';

import messages from '../../Messages';
import { useUnassignSystemsHook } from './useUnassignSystemsHook';
import { renderUnassignModalMessages, filterSystemsWithoutSets } from './Helpers';

const UnassignSystemsModal = ({ unassignSystemsModalState = {}, setUnassignSystemsModalOpen, intl }) => {
    const { systemsIDs, isUnassignSystemsModalOpen } = unassignSystemsModalState;
    const [systemsWithPatchSet, setSystemWithPatchSet] = useState([]);
    const [systemsLoading, setSystemsLoading] = useState(true);

    const handleModalToggle = (shouldRefresh) => {
        setUnassignSystemsModalOpen({
            isUnassignSystemsModalOpen: !isUnassignSystemsModalOpen,
            systemsIDs: [],
            shouldRefresh
        });
    };

    const handleModalClose = () => {
        handleModalToggle(false);
    };

    const handleUnassignment = useUnassignSystemsHook(handleModalToggle, systemsWithPatchSet);

    useEffect(() => {
        setSystemsLoading(true);

        filterSystemsWithoutSets(systemsIDs).then(result => {
            setSystemWithPatchSet(result);
            setSystemsLoading(false);
        });
    }, [systemsIDs]);

    const systemsWithoutPatchSetCount = systemsIDs.length - systemsWithPatchSet.length;

    return (
        <Modal
            variant={'small'}
            isOpen={unassignSystemsModalState.isUnassignSystemsModalOpen}
            title={intl.formatMessage(messages.textUnassignSystemsTitle)}
            onClose={handleModalClose}
            titleIconVariant="warning"
            actions={[
                <Button
                    key="confirm"
                    variant="danger"
                    onClick={handleUnassignment}
                    isDisabled={systemsLoading || systemsWithPatchSet.length === 0}
                >
                    {intl.formatMessage(messages.labelsRemove)}
                </Button>,
                <Button key="cancel" variant="link" onClick={handleModalClose}>
                    {intl.formatMessage(messages.labelsCancel)}
                </Button>
            ]}
        >
            <Grid hasGutter>
                {systemsLoading
                    ? <Skeleton />
                    : <Fragment>
                        {systemsWithPatchSet.length > 0 &&
                            renderUnassignModalMessages('textUnassignSystemsStatement', systemsWithPatchSet.length, intl)
                        }
                        {systemsWithoutPatchSetCount > 0 &&
                            renderUnassignModalMessages('textUnassignSystemsWarning', systemsWithoutPatchSetCount, intl)
                        }
                    </Fragment>
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

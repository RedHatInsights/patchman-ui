import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Modal, Button, Stack, StackItem, Form } from '@patternfly/react-core';
import { injectIntl } from 'react-intl';
import SelectExistingSets from '../PatchSetWizard/InputFields/SelectExistingSets';
import messages from '../../Messages';
import {  updatePatchSets } from '../../Utilities/api';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { patchSetAssignSystemsNotifications } from '../PatchSet/PatchSetAssets';
import { filterSelectedActiveSystemIDs } from '../../Utilities/Helpers';

const AssignSystemsModal = ({ patchSetState = {}, setPatchSetState, intl }) => {
    const dispatch = useDispatch();

    const { systemsIDs, isAssignSystemsModalOpen } = patchSetState;
    const [selectedPatchSet, setSelectedPatchSet] = useState([]);
    const [selectedPatchSetDetails, setSelectedPatchSetDetails] = useState({});

    const closeModal = () => {
        setPatchSetState({
            isAssignSystemsModalOpen: !isAssignSystemsModalOpen,
            systemsIDs: []
        });
        setSelectedPatchSet([]);
        setSelectedPatchSetDetails({});
    };

    const submitModal = () => {
        updatePatchSets({ inventory_ids: systemsIDs }, selectedPatchSetDetails.id)
        .then(() => {
            dispatch(addNotification(patchSetAssignSystemsNotifications(Object.keys(systemsIDs).length).success));
            setPatchSetState({
                ...patchSetState,
                shouldRefresh: true,
                isAssignSystemsModalOpen: false,
                systemsIDs: []
            });
        });

        closeModal();
    };

    const openWizard = () => {
        setPatchSetState({
            ...patchSetState,
            isPatchSetWizardOpen: true,
            systemsIDs: filterSelectedActiveSystemIDs(systemsIDs),
            shouldRefresh: false
        });
        setSelectedPatchSet([]);
        setSelectedPatchSetDetails({});
    };

    return (
        <Modal
            variant={'small'}
            isOpen={patchSetState.isAssignSystemsModalOpen}
            title={intl.formatMessage(messages.templateApply)}
            onClose={closeModal}
            actions={[
                <Button
                    key="confirm"
                    isDisabled={!selectedPatchSetDetails?.id}
                    onClick={submitModal}
                >
                    {intl.formatMessage(messages.templateApply)}
                </Button>,
                <Button key="cancel" variant="link" onClick={closeModal}>
                    {intl.formatMessage(messages.labelsCancel)}
                </Button>
            ]}
        >
            <Stack hasGutter>
                <StackItem>
                    {intl.formatMessage(messages.templateSelect, { systemCount: Object.keys(systemsIDs).length })}
                </StackItem>
                <StackItem>
                    <Form>
                        <SelectExistingSets
                            setSelectedPatchSet={setSelectedPatchSet}
                            selectedSets={selectedPatchSet}
                            selectCallback={setSelectedPatchSetDetails}
                        />
                    </Form>
                </StackItem>
                <StackItem>
                    {intl.formatMessage(messages.templateOr)}
                </StackItem>
                <StackItem>
                    <Button variant="secondary" onClick={openWizard}>
                        {intl.formatMessage(messages.templateCreate)}
                    </Button>
                </StackItem>
            </Stack>
        </Modal>
    );
};

AssignSystemsModal.propTypes = {
    intl: propTypes.any,
    setPatchSetState: propTypes.func,
    patchSetState: propTypes.object
};

export default injectIntl(AssignSystemsModal);

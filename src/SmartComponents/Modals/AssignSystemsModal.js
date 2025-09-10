import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import {
    Button,
    Stack,
    StackItem,
    Form,
    Spinner
} from '@patternfly/react-core';
import {
    Modal
} from '@patternfly/react-core/deprecated';
import { injectIntl } from 'react-intl';
import SelectExistingSets from '../PatchSetWizard/InputFields/SelectExistingSets';
import messages from '../../Messages';
import { updatePatchSets } from '../../Utilities/api';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { patchSetAssignSystemsNotifications } from '../PatchSet/PatchSetAssets';
import { filterSelectedActiveSystemIDs } from '../../Utilities/Helpers';
import { filterSatelliteManagedSystems } from './Helpers';
import { useFetchBatched } from '../../Utilities/hooks';
import isEmpty from 'lodash/isEmpty';

const AssignSystemsModal = ({ patchSetState = {}, setPatchSetState, intl, totalItems }) => {
    const dispatch = useDispatch();

    const { systemsIDs, isAssignSystemsModalOpen } = patchSetState;
    const [selectedPatchSet, setSelectedPatchSet] = useState([]);
    const [selectedPatchSetDetails, setSelectedPatchSetDetails] = useState({});

    const [systemsNotManagedBySatellite, setSystemsNotManagedBySatellite] = useState([]);
    const [systemsLoading, setSystemsLoading] = useState(true);
    const { fetchBatched } = useFetchBatched();

    const closeModal = () => {
        setPatchSetState({
            isAssignSystemsModalOpen: !isAssignSystemsModalOpen,
            systemsIDs: []
        });
        setSelectedPatchSet([]);
        setSelectedPatchSetDetails({});
    };

    const submitModal = () => {
        const systems = systemsNotManagedBySatellite.reduce((obj, item) => {
            obj[item] = true;
            return obj;
        }, {});

        updatePatchSets({ inventory_ids: systemsIDs }, selectedPatchSetDetails.id)
        .then(() => {
            dispatch(addNotification(patchSetAssignSystemsNotifications(Object.keys(systems).length).success));
            setPatchSetState({
                ...patchSetState,
                shouldRefresh: true,
                isAssignSystemsModalOpen: false,
                systemsIDs: []
            });
        })
        .catch(() => {
            dispatch(addNotification(patchSetAssignSystemsNotifications().failure));
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
        setSystemsLoading(true);
    };

    useEffect(() => {
        if (systemsIDs && !isEmpty(systemsIDs)) {
            setSystemsLoading(true);
            filterSatelliteManagedSystems(
                Object.keys(systemsIDs),
                fetchBatched,
                totalItems
            ).then(result => {
                setSystemsNotManagedBySatellite(result);
                setSystemsLoading(false);
            });
        }
    }, [systemsIDs]);

    const systemsManagedBySatelliteCount = Object.keys(systemsIDs).length - systemsNotManagedBySatellite.length;

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
            data-testid='assign-systems-modal'
        >
            {systemsLoading
                ? <Spinner />
                : systemsNotManagedBySatellite.length === 0
                    ? systemsNotManagedBySatellite.length === 1
                        ? 'Template cannot be applied to the selected system.'
                        : 'Template cannot be applied to any of the selected systems.'
                    : <Stack hasGutter>
                        <StackItem>
                            {intl.formatMessage(messages.templateSelect, {
                                systemCount: systemsNotManagedBySatellite.length,
                                b: (...chunks) => <b>{chunks}</b>
                            })}
                        </StackItem>
                        {systemsManagedBySatelliteCount > 0 && <StackItem>{
                            intl.formatMessage(messages.templateSelectSatellite, {
                                systemCount: systemsManagedBySatelliteCount,
                                b: (...chunks) => <b>{chunks}</b>
                            })}
                        </StackItem>
                        }
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
            }
        </Modal>
    );
};

AssignSystemsModal.propTypes = {
    intl: propTypes.any,
    setPatchSetState: propTypes.func,
    patchSetState: propTypes.object,
    totalItems: propTypes.number
};

export default injectIntl(AssignSystemsModal);

import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useState, Fragment } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
//import { NoSmartManagement } from '../../PresentationalComponents/Snippets/EmptyStates';
//import TableView from '../../PresentationalComponents/TableView/TableView';
//import { useEntitlements } from '../../Utilities/Hooks';
import { fetchPatchSetAction } from '../../store/Actions/Actions';
import { Dropdown, DropdownItem, DropdownPosition, DropdownToggle, Skeleton } from '@patternfly/react-core';
import DeleteSetModal from '../Modals/DeleteSetModal';
import { deletePatchSet } from '../../Utilities/api';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { patchSetDeleteNotifications } from '../../Utilities/constants';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';

const PatchSetDetail = () => {
    //const getEntitlements = useEntitlements();
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const patchSetId = history.location.pathname.split('/')[2];

    const [isHeaderDropdownOpen, setHeaderDropdownOpen] = useState(false);

    // const [hasSmartManagement, setSmartManagement] = React.useState(true);

    const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);

    const templateDetails = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore
    );

    const status = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore.status
    );

    const { hasError, metadata, isLoading, code } = status;

    const patchSetName = templateDetails.data.attributes.name;

    useEffect(() => {
        /*
        getEntitlements().then((entitelements) => {
            setSmartManagement(
                entitelements?.smart_management?.is_entitled
            );
        });
        */

        dispatch(fetchPatchSetAction(patchSetId));
    }, []);

    const deleteSet = () => {
        deletePatchSet(patchSetId).then(() => {
            dispatch(addNotification(patchSetDeleteNotifications(patchSetName).success));
            history.push('/templates');
        }).catch(() => {
            dispatch(addNotification(patchSetDeleteNotifications(patchSetName).error));
        });
    };

    const dropdownItems = [
        <DropdownItem
            key="delete-patch-set"
            component="button"
            onClick={() => setDeleteConfirmModalOpen(true)}
        >
            {intl.formatMessage(messages.labelsButtonRemoveTemplate)}
        </DropdownItem>
    ];

    return (
        (hasError || metadata?.has_systems === false)
            ? <ErrorHandler code={code} metadata={metadata} />
            : <Fragment>
                <DeleteSetModal
                    templateName={patchSetName}
                    isModalOpen={isDeleteConfirmModalOpen}
                    setModalOpen={setDeleteConfirmModalOpen}
                    onConfirm={deleteSet}
                />
                <Header
                    title={isLoading ? <Skeleton style={{ width: 300 }} /> : patchSetName}
                    headerOUIA={'template-details'}
                    breadcrumbs={[
                        {
                            title: intl.formatMessage(messages.templateDetailHeaderBreadcrumb),
                            to: '/templates',
                            isActive: false
                        },
                        {
                            title: isLoading ? <Skeleton style={{ width: 150 }} /> : patchSetName,
                            isActive: true
                        }
                    ]}
                    actions={
                        <Dropdown
                            position={DropdownPosition.right}
                            onSelect={() => {
                                setHeaderDropdownOpen(false);
                                document.getElementById('patch-set-detail-header-kebab').focus();
                            }}
                            toggle={
                                <DropdownToggle
                                    id="patch-set-detail-header-kebab"
                                    className="pf-u-mr-xl"
                                    onToggle={(isOpen) => setHeaderDropdownOpen(isOpen)}
                                    style={{ minWidth: 150 }}
                                >
                                    {intl.formatMessage(messages.labelsActions)}
                                </DropdownToggle>
                            }
                            isOpen={isHeaderDropdownOpen}
                            dropdownItems={dropdownItems}
                        />
                    }
                >
                    <table border="0" style={{ marginTop: 8 }}>
                        <tbody>
                            <tr>
                                <td style={{ width: 250 }}>Template description:</td>
                                <td>
                                    {isLoading
                                        ? <Skeleton style={{ width: 300 }} />
                                        : templateDetails.data.attributes.description
                                        || intl.formatMessage(messages.titlesTemplateNoDescription)}
                                </td>
                            </tr>
                            <tr>
                                <td>Red Hat repositories up to:</td>
                                <td>
                                    {isLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.config.to_time)}
                                </td>
                            </tr>
                            <tr>
                                <td>Created by:</td>
                                <td>
                                    {isLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : templateDetails.data.attributes.creator}
                                </td>
                            </tr>
                            <tr>
                                <td>Published:</td>
                                <td>
                                    {isLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.published)}
                                </td>
                            </tr>
                            <tr>
                                <td>Last edited:</td>
                                <td>
                                    {isLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.last_edited)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Header>
                <Main>
                    {/*
                {hasSmartManagement ? <TableView
                    columns={patchSetColumns}
                    compact
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    onSort={onSort}
                    selectedRows={IS_SELECTION_ENABLED && selectedRows}
                    onSelect={IS_SELECTION_ENABLED && onSelect}
                    sortBy={sortBy}
                    apply={apply}
                    tableOUIA={'patch-set-table'}
                    paginationOUIA={'patch-set-pagination'}
                    store={{ rows, metadata, status, queryParams }}
                    actionsConfig={(patchSets?.length > 0) && actionsConfig}
                    filterConfig={filterConfig}
                    searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchTemplateTitle)}
                    CreatePatchSetButton={CreatePatchSetButton}
                    actionsToggle={!hasAccess ? CustomActionsToggle : null}
                /> : <NoSmartManagement />}
                */}
                </Main>
            </Fragment >);
};

export default PatchSetDetail;

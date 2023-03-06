import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import { NoAppliedSystems, NoSmartManagement } from '../../PresentationalComponents/Snippets/EmptyStates';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { useDeepCompareEffect, useEntitlements, usePerPageSelect, useSetPage, useSortColumn } from '../../Utilities/Hooks';
import {
    changePatchSetDetailsSystemsParams,
    clearTemplateDetail,
    fetchPatchSetDetailSystemsAction,
    fetchTemplateDetail
} from '../../store/Actions/Actions';
import { Dropdown, DropdownItem, DropdownPosition, DropdownToggle, Skeleton, Text, TextContent } from '@patternfly/react-core';
import DeleteSetModal from '../Modals/DeleteSetModal';
import { deletePatchSet } from '../../Utilities/api';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { patchSetDeleteNotifications } from '../../Utilities/constants';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { patchSetDetailColumns } from './PatchSetDetailAssets';
import { createPatchSetDetailRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams } from '../../Utilities/Helpers';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';

const PatchSetDetail = () => {
    const getEntitlements = useEntitlements();
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const patchSetId = history.location.pathname.split('/')[2];

    const [firstMount, setFirstMount] = React.useState(true);
    const [isHeaderDropdownOpen, setHeaderDropdownOpen] = useState(false);
    const [hasSmartManagement, setSmartManagement] = React.useState(true);
    const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
    const [wizardState, setWizardState] = useState({
        isPatchSetWizardOpen: false,
        systemsIDs: [],
        shouldRefresh: false
    });

    const templateDetails = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore
    );

    const isHeaderLoading = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore?.status?.isLoading ?? true
    );

    const status = useSelector(
        ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore.status
    );

    const assignedSystems = useSelector(
        ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore.rows
    );

    const metadata = useSelector(
        ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore.metadata
    );

    const queryParams = useSelector(
        ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore.queryParams
    );

    const rows = useMemo(
        () => createPatchSetDetailRows(assignedSystems),
        [assignedSystems]
    );

    const { hasError, code } = status;

    const patchSetName = templateDetails.data.attributes.name;

    const apply = (params) => {
        dispatch(changePatchSetDetailsSystemsParams(params));
    };

    const onSetPage = useSetPage(metadata?.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    const onSort = useSortColumn(patchSetDetailColumns, apply, 0);
    const sortBy = useMemo(
        () => createSortBy(patchSetDetailColumns, metadata?.sort, 0),
        [metadata?.sort]
    );

    const openPatchSetAssignWizard = () => {
        setWizardState({
            isPatchSetWizardOpen: true
        });
    };

    const refreshTable = () => {
        dispatch(fetchPatchSetDetailSystemsAction(patchSetId, { ...queryParams, page: 1, offset: 0 }));
        dispatch(fetchTemplateDetail(patchSetId));
    };

    // const handleSystemRemoval = useUnassignSystemsHook();

    // const actionsConfig = patchSetDetailRowActions(handleSystemRemoval);

    useEffect(() => {
        getEntitlements().then((entitelements) => {
            setSmartManagement(
                entitelements?.smart_management?.is_entitled
            );
        });

        return () => {
            dispatch(changePatchSetDetailsSystemsParams());
            dispatch(clearTemplateDetail());
        };
    }, []);

    useEffect(() => {
        if (wizardState.shouldRefresh === true) {
            refreshTable();
        }
    }, [wizardState.shouldRefresh]);

    useDeepCompareEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams(history.location.search));

            dispatch(fetchTemplateDetail(patchSetId));

            setFirstMount(false);
        } else {
            history.push(encodeURLParams(queryParams));

            dispatch(fetchPatchSetDetailSystemsAction(patchSetId, queryParams));
        }
    }, [queryParams, firstMount]);

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
            key="edit-patch-set"
            component="button"
            onClick={() => openPatchSetAssignWizard()}
        >
            {intl.formatMessage(messages.labelsButtonEditTemplate)}
        </DropdownItem>,
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
            ? <ErrorHandler code={code} metadata={status.metadata} />
            : <Fragment>
                <DeleteSetModal
                    templateName={patchSetName}
                    isModalOpen={isDeleteConfirmModalOpen}
                    setModalOpen={setDeleteConfirmModalOpen}
                    onConfirm={deleteSet}
                />
                {wizardState.isPatchSetWizardOpen &&
                <PatchSetWizard
                    systemsIDs={wizardState.systemsIDs}
                    setBaselineState={setWizardState}
                    patchSetID={patchSetId}
                />}
                <Header
                    title={isHeaderLoading ? <Skeleton style={{ width: 300 }} /> : patchSetName}
                    headerOUIA={'template-details'}
                    breadcrumbs={[
                        {
                            title: intl.formatMessage(messages.templateDetailHeaderBreadcrumb),
                            to: '/templates',
                            isActive: false
                        },
                        {
                            title: isHeaderLoading ? <Skeleton style={{ width: 150 }} /> : patchSetName,
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
                                <td style={{ width: 300 }}>Template description:</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 300 }} />
                                        : templateDetails.data.attributes.description
                                        || intl.formatMessage(messages.titlesTemplateNoDescription)}
                                </td>
                            </tr>
                            <tr>
                                <td>Includes Red Hat repositories up to:</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.config.to_time)}
                                </td>
                            </tr>
                            <tr>
                                <td>Created by:</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : templateDetails.data.attributes.creator}
                                </td>
                            </tr>
                            <tr>
                                <td>Published:</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.published)}
                                </td>
                            </tr>
                            <tr>
                                <td>Last edited:</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.last_edited)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Header>
                <Main>
                    <TextContent>
                        <Text component="h2" className="pf-u-mb-md">
                            {intl.formatMessage(messages.templateDetailTableTitle)}
                        </Text>
                    </TextContent>
                    {hasSmartManagement ? (rows.length === 0 && !status.isLoading) ? <NoAppliedSystems /> : <TableView
                        columns={patchSetDetailColumns}
                        compact
                        onSetPage={onSetPage}
                        onPerPageSelect={onPerPageSelect}
                        onSort={onSort}
                        sortBy={sortBy}
                        apply={apply}
                        tableOUIA={'patch-set-detail-table'}
                        paginationOUIA={'patch-set-detail-pagination'}
                        store={{ rows, metadata, status, queryParams }}
                        /* actionsConfig={actionsConfig} */
                        searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchTemplateTitle)}
                    /> : <NoSmartManagement />}
                </Main>
            </Fragment >);
};

export default PatchSetDetail;

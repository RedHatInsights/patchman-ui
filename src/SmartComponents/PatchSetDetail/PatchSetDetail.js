import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useState, Fragment, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector, useStore } from 'react-redux';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import { NoAppliedSystems } from '../../PresentationalComponents/Snippets/EmptyStates';
import { useDeepCompareEffect, useGetEntities } from '../../Utilities/Hooks';
import {
    changePatchSetDetailsSystemsMetadata,
    changePatchSetDetailsSystemsParams,
    changeTags,
    clearTemplateDetail,
    fetchPatchSetSystemsNoFiltersAction,
    fetchTemplateDetail
} from '../../store/Actions/Actions';
import {
    Bullseye,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    DropdownToggle,
    Skeleton,
    Spinner,
    Text,
    TextContent
} from '@patternfly/react-core';
import DeleteSetModal from '../Modals/DeleteSetModal';
import { deletePatchSet, fetchPatchSetSystems } from '../../Utilities/api';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { patchSetDeleteNotifications } from '../../Utilities/constants';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { decodeQueryparams, encodeURLParams, persistantParams } from '../../Utilities/Helpers';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';
import { patchSetDetailRowActions } from '../PatchSet/PatchSetAssets';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import UnassignSystemsModal from '../Modals/UnassignSystemsModal';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { templateSystemsColumnsMerger } from '../../Utilities/SystemsHelpers';
import { combineReducers } from 'redux';
import { defaultReducers } from '../../store';
import { inventoryEntitiesReducer, modifyTemplateDetailSystems } from '../../store/Reducers/InventoryEntitiesReducer';
import { systemsListColumns } from '../Systems/SystemsListAssets';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const PatchSetDetail = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { templateName: patchSetId } = useParams();
    const navigate = useNavigate();

    const store = useStore();
    const inventory = useRef(null);

    const [firstMount, setFirstMount] = React.useState(true);
    const [isHeaderDropdownOpen, setHeaderDropdownOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
    const [patchSetState, setPatchSetState] = useState({
        isPatchSetWizardOpen: false,
        isUnassignSystemsModalOpen: false,
        systemsIDs: [],
        shouldRefresh: false
    });

    const templateDetails = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore
    );

    const isHeaderLoading = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore?.status?.isLoading ?? true
    );

    const detailStatus = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore.status
    );

    const systemStatus = useSelector(
        ({ entities }) => entities?.status || {}
    );

    const totalItems = useSelector(
        ({ entities }) => entities?.total || 0
    );

    const queryParams = useSelector(
        ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore?.queryParams || {}
    );

    const templateHasSystemsLoading = useSelector(
        ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore?.templateHasSystemsLoading
    );

    const templateHasSystems = useSelector(
        ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore?.templateHasSystems
    );

    const { hasAccess } = usePermissionsWithContext([
        'patch:*:*',
        'patch:template:write'
    ]);

    const patchSetName = templateDetails.data.attributes.name;

    const apply = (params) => {
        dispatch(changePatchSetDetailsSystemsParams(params));
    };

    const openPatchSetAssignWizard = () => {
        setPatchSetState({
            ...patchSetState,
            isPatchSetWizardOpen: true
        });
    };

    const refreshTable = () => {
        // timestamp is used to force inventory to refresh
        // if it wasn't there inventory might ignore request to refresh because parameters are the same
        inventory?.current?.onRefreshData({ timestamp: Date.now() });

        dispatch(fetchTemplateDetail(patchSetId));
    };

    useEffect(() => {
        dispatch(fetchPatchSetSystemsNoFiltersAction({ id: patchSetId, limit: 1 }));

        return () => {
            dispatch(clearTemplateDetail());
        };
    }, []);

    useEffect(() => {
        if (patchSetState.shouldRefresh === true) {
            refreshTable();
            setPatchSetState({ ...patchSetState, shouldRefresh: false });
            dispatch(fetchPatchSetSystemsNoFiltersAction({ id: patchSetId, limit: 1 }));
        }
    }, [patchSetState.shouldRefresh]);

    useDeepCompareEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams('?' + searchParams.toString()));

            dispatch(fetchTemplateDetail(patchSetId));

            setFirstMount(false);
        } else {
            setSearchParams(encodeURLParams(queryParams));
        }
    }, [queryParams, firstMount]);

    const openSystemUnassignModal = (rowData) => {
        setPatchSetState({ ...patchSetState, isUnassignSystemsModalOpen: true, systemsIDs: [rowData.id] });
    };

    const deleteSet = () => {
        deletePatchSet(patchSetId).then(() => {
            dispatch(addNotification(patchSetDeleteNotifications(patchSetName).success));
            // history.push('/templates');
            navigate('../templates');
        }).catch(() => {
            dispatch(addNotification(patchSetDeleteNotifications(patchSetName).error));
        });
    };

    const applyMetadata = (metadata) => {
        dispatch(changePatchSetDetailsSystemsMetadata(metadata));
    };

    const applyGlobalFilter = (tags) => {
        dispatch(changeTags(tags));
    };

    const getEntities = useGetEntities(
        fetchPatchSetSystems,
        apply,
        { id: patchSetId },
        setSearchParams,
        applyMetadata,
        applyGlobalFilter
    );

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

    const decodedParams = decodeQueryparams('?' + searchParams.toString());

    const { systemProfile, selectedTags, filter, search, page, perPage, sort } = queryParams;

    return (
        detailStatus?.hasError
            ? <ErrorHandler code={detailStatus?.code} />
            : <Fragment>
                <DeleteSetModal
                    templateName={patchSetName}
                    isModalOpen={isDeleteConfirmModalOpen}
                    setModalOpen={setDeleteConfirmModalOpen}
                    onConfirm={deleteSet}
                />
                {patchSetState.isPatchSetWizardOpen &&
                    <PatchSetWizard
                        systemsIDs={patchSetState.systemsIDs}
                        setBaselineState={setPatchSetState}
                        patchSetID={patchSetId}
                    />}
                <UnassignSystemsModal
                    unassignSystemsModalState={patchSetState}
                    setUnassignSystemsModalOpen={setPatchSetState}
                />
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
                                <td style={{ width: 300 }}>{intl.formatMessage(messages.templateDetailTableDescription)}</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 300 }} />
                                        : templateDetails.data.attributes.description
                                        || intl.formatMessage(messages.titlesTemplateNoDescription)}
                                </td>
                            </tr>
                            <tr>
                                <td>{intl.formatMessage(messages.templateDetailTableUpToDate)}</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.config.to_time)}
                                </td>
                            </tr>
                            <tr>
                                <td>{intl.formatMessage(messages.templateDetailTableCreatedBy)}</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : templateDetails.data.attributes.creator}
                                </td>
                            </tr>
                            <tr>
                                <td>{intl.formatMessage(messages.templateDetailTablePublished)}</td>
                                <td>
                                    {isHeaderLoading
                                        ? <Skeleton style={{ width: 100 }} />
                                        : processDate(templateDetails.data.attributes.published)}
                                </td>
                            </tr>
                            <tr>
                                <td>{intl.formatMessage(messages.templateDetailTableLastEdited)}</td>
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
                    {templateHasSystemsLoading
                        ? (
                            <Bullseye>
                                <Spinner size="xl" />
                            </Bullseye>
                        ) : templateHasSystems
                            ? systemStatus.hasError
                                ? <ErrorHandler code={systemStatus.code} />
                                : <InventoryTable
                                    ref={inventory}
                                    isFullView
                                    autoRefresh
                                    initialLoading
                                    hideFilters={{ all: true }}
                                    columns={(defaultColumns) => templateSystemsColumnsMerger(defaultColumns)}
                                    showTags
                                    onLoad={({ mergeWithEntities }) => {
                                        store.replaceReducer(combineReducers({
                                            ...defaultReducers,
                                            ...mergeWithEntities(
                                                inventoryEntitiesReducer(systemsListColumns(true), modifyTemplateDetailSystems),
                                                persistantParams({ page, perPage, sort, search }, decodedParams)
                                            )
                                        }));
                                    }}
                                    customFilters={{
                                        patchParams: {
                                            filter,
                                            systemProfile,
                                            selectedTags
                                        }
                                    }}
                                    paginationProps={{
                                        isDisabled: totalItems === 0
                                    }}
                                    getEntities={getEntities}
                                    tableProps={{
                                        canSelectAll: true,
                                        variant: TableVariant.compact,
                                        className: 'patchCompactInventory',
                                        isStickyHeader: true,
                                        actionResolver: () => hasAccess ? patchSetDetailRowActions(openSystemUnassignModal) : []
                                    }}
                                    hasCheckbox={false} /* TODO: Remove this when implementing bulk actions */
                                />
                            : <NoAppliedSystems onButtonClick={() => openPatchSetAssignWizard()} />}
                </Main>
            </Fragment>
    );
};

export default PatchSetDetail;

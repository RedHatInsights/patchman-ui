import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useState, Fragment, useRef } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import { NoAppliedSystems } from '../../PresentationalComponents/Snippets/EmptyStates';
import {
  useBulkSelectConfig,
  useDeepCompareEffect,
  useGetEntities,
  useRemoveFilter,
  ID_API_ENDPOINTS,
  useOnSelect,
} from '../../Utilities/hooks';
import {
  changePatchSetDetailsSystemsMetadata,
  changePatchSetDetailsSystemsParams,
  changeTags,
  clearInventoryReducer,
  clearTemplateDetail,
  fetchPatchSetSystemsNoFiltersAction,
  fetchTemplateDetail,
  systemSelectAction,
} from '../../store/Actions/Actions';
import {
  Bullseye,
  Skeleton,
  Spinner,
  Content,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
} from '@patternfly/react-core';
import DeleteSetModal from '../Modals/DeleteSetModal';
import { deletePatchSet, fetchPatchSetSystems } from '../../Utilities/api';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { patchSetDeleteNotifications } from '../../Utilities/constants';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import {
  arrayFromObj,
  decodeQueryparams,
  encodeURLParams,
  filterSelectedActiveSystemIDs,
  persistantParams,
} from '../../Utilities/Helpers';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';
import { patchSetDetailRowActions } from '../PatchSet/PatchSetAssets';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import UnassignSystemsModal from '../Modals/UnassignSystemsModal';
import { TableVariant } from '@patternfly/react-table';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import {
  buildActiveFiltersConfig,
  buildTemplateFilterConfig,
  templateSystemsColumnsMerger,
} from '../../Utilities/SystemsHelpers';
import { combineReducers } from 'redux';
import { defaultReducers } from '../../store';
import {
  inventoryEntitiesReducer,
  modifyTemplateDetailSystems,
} from '../../store/Reducers/InventoryEntitiesReducer';
import { SYSTEMS_LIST_COLUMNS } from '../Systems/SystemsListAssets';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const PatchSetDetail = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const chrome = useChrome();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const store = useStore();
  const inventory = useRef(null);

  const { templateName: patchSetId } = useParams();
  const addNotification = useAddNotification();

  const [firstMount, setFirstMount] = React.useState(true);
  const [isHeaderDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [patchSetState, setPatchSetState] = useState({
    isPatchSetWizardOpen: false,
    isUnassignSystemsModalOpen: false,
    systemsIDs: [],
    shouldRefresh: false,
  });

  const templateDetails = useSelector(({ PatchSetDetailStore }) => PatchSetDetailStore);

  const isHeaderLoading = useSelector(
    ({ PatchSetDetailStore }) => PatchSetDetailStore?.status?.isLoading ?? true,
  );

  const detailStatus = useSelector(({ PatchSetDetailStore }) => PatchSetDetailStore.status);

  const systems = useSelector(({ entities }) => entities?.rows || [], shallowEqual);

  const selectedRows = useSelector(({ entities }) => entities?.selectedRows || []);

  const systemStatus = useSelector(({ entities }) => entities?.status || {});

  const totalItems = useSelector(({ entities }) => entities?.total || 0);

  const queryParams = useSelector(
    ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore?.queryParams || {},
  );

  const templateHasSystemsLoading = useSelector(
    ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore?.templateHasSystemsLoading,
  );

  const templateHasSystems = useSelector(
    ({ PatchSetDetailSystemsStore }) => PatchSetDetailSystemsStore?.templateHasSystems,
  );

  const { hasAccess } = usePermissionsWithContext(['patch:*:*', 'patch:template:write']);

  const patchSetName = templateDetails.data.attributes.name;

  useEffect(() => {
    patchSetName && chrome.updateDocumentTitle(`${patchSetName} - Templates - Patch | RHEL`, true);
  }, [chrome, patchSetName]);

  const onSelect = useOnSelect(systems, selectedRows, {
    endpoint: ID_API_ENDPOINTS.templateSystems(patchSetId),
    queryParams,
    selectionDispatcher: systemSelectAction,
    totalItems,
  });

  const apply = (params) => {
    dispatch(changePatchSetDetailsSystemsParams(params));
  };

  const openPatchSetAssignWizard = () => {
    setPatchSetState({
      ...patchSetState,
      isPatchSetWizardOpen: true,
    });
  };

  const refreshTable = () => {
    // timestamp is used to force inventory to refresh
    // if it wasn't there inventory might ignore request to refresh because parameters are the same
    inventory?.current?.onRefreshData({ timestamp: Date.now() });

    onSelect('none');

    dispatch(fetchTemplateDetail(patchSetId));
  };

  useEffect(() => {
    dispatch(fetchPatchSetSystemsNoFiltersAction({ id: patchSetId, limit: 1 }));

    return () => {
      dispatch(clearTemplateDetail());
      dispatch(clearInventoryReducer());
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

  const openSystemUnassignModal = (ids) => {
    setPatchSetState({ ...patchSetState, isUnassignSystemsModalOpen: true, systemsIDs: ids });
  };

  const deleteSet = () => {
    deletePatchSet(patchSetId)
      .then(() => {
        addNotification(patchSetDeleteNotifications(patchSetName).success);
        navigate('../templates');
      })
      .catch(() => {
        addNotification(patchSetDeleteNotifications(patchSetName).error);
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
    applyGlobalFilter,
  );

  const addTooltip = (children, key) => (
    <Tooltip key={key} content={hasAccess || 'For editing access, contact your administrator.'}>
      {children}
    </Tooltip>
  );

  const editTemplateButton = (
    <DropdownItem
      component='button'
      onClick={() => openPatchSetAssignWizard()}
      isDisabled={!hasAccess}
    >
      {intl.formatMessage(messages.labelsButtonEditTemplate)}
    </DropdownItem>
  );

  const deleteTemplateButton = (
    <DropdownItem
      component='button'
      onClick={() => setDeleteConfirmModalOpen(true)}
      isDisabled={!hasAccess}
    >
      {intl.formatMessage(messages.labelsButtonRemoveTemplate)}
    </DropdownItem>
  );

  const dropdownItems = [
    hasAccess ? editTemplateButton : addTooltip(editTemplateButton, 'edit-template'),
    hasAccess ? deleteTemplateButton : addTooltip(deleteTemplateButton, 'delete-template'),
  ];

  const decodedParams = decodeQueryparams('?' + searchParams.toString());

  const { systemProfile, selectedTags, filter, search, page, perPage, sort } = queryParams;

  const selectedCount = selectedRows && arrayFromObj(selectedRows).length;

  const bulkSelectConfig = useBulkSelectConfig(
    selectedCount,
    onSelect,
    { total_items: totalItems },
    systems,
  );

  const [deleteFilters] = useRemoveFilter({ search, ...filter }, apply);

  const filterConfig = buildTemplateFilterConfig(search, apply);

  const activeFiltersConfig = buildActiveFiltersConfig(filter, search, deleteFilters);

  return detailStatus?.hasError ? (
    <ErrorHandler code={detailStatus?.code} />
  ) : (
    <Fragment>
      <DeleteSetModal
        templateName={patchSetName}
        isModalOpen={isDeleteConfirmModalOpen}
        setModalOpen={setDeleteConfirmModalOpen}
        onConfirm={deleteSet}
      />
      {patchSetState.isPatchSetWizardOpen && (
        <PatchSetWizard
          systemsIDs={patchSetState.systemsIDs}
          setBaselineState={setPatchSetState}
          patchSetID={patchSetId}
        />
      )}
      <UnassignSystemsModal
        unassignSystemsModalState={patchSetState}
        setUnassignSystemsModalOpen={setPatchSetState}
      />
      <Header
        title={isHeaderLoading ? <Skeleton style={{ width: 300 }} /> : patchSetName}
        headerOUIA='template-details'
        breadcrumbs={[
          {
            title: intl.formatMessage(messages.templateDetailHeaderBreadcrumb),
            to: '/templates',
            isActive: false,
          },
          {
            title: isHeaderLoading ? <Skeleton style={{ width: 150 }} /> : patchSetName,
            isActive: true,
          },
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
                id='patch-set-detail-header-kebab'
                className='pf-v6-u-mr-xl'
                onToggle={(_event, isOpen) => setHeaderDropdownOpen(isOpen)}
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
        <table border='0' style={{ marginTop: 8 }}>
          <tbody>
            <tr>
              <td style={{ width: 300 }}>
                {intl.formatMessage(messages.templateDetailTableDescription)}
              </td>
              <td>
                {isHeaderLoading ? (
                  <Skeleton style={{ width: 300 }} />
                ) : (
                  templateDetails.data.attributes.description ||
                  intl.formatMessage(messages.titlesTemplateNoDescription)
                )}
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(messages.templateDetailTableUpToDate)}</td>
              <td>
                {isHeaderLoading ? (
                  <Skeleton style={{ width: 100 }} />
                ) : (
                  processDate(templateDetails.data.attributes.config.to_time)
                )}
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(messages.templateDetailTableCreatedBy)}</td>
              <td>
                {isHeaderLoading ? (
                  <Skeleton style={{ width: 100 }} />
                ) : (
                  templateDetails.data.attributes.creator
                )}
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(messages.templateDetailTablePublished)}</td>
              <td>
                {isHeaderLoading ? (
                  <Skeleton style={{ width: 100 }} />
                ) : (
                  processDate(templateDetails.data.attributes.published)
                )}
              </td>
            </tr>
            <tr>
              <td>{intl.formatMessage(messages.templateDetailTableLastEdited)}</td>
              <td>
                {isHeaderLoading ? (
                  <Skeleton style={{ width: 100 }} />
                ) : (
                  processDate(templateDetails.data.attributes.last_edited)
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Header>
      <Main>
        <Content>
          <Content component='h2' className='pf-v6-u-mb-md'>
            {intl.formatMessage(messages.templateDetailTableTitle)}
          </Content>
        </Content>
        {templateHasSystemsLoading ? (
          <Bullseye>
            <Spinner size='xl' />
          </Bullseye>
        ) : templateHasSystems ? (
          systemStatus.hasError ? (
            <ErrorHandler code={systemStatus.code} />
          ) : (
            <InventoryTable
              ref={inventory}
              isFullView
              autoRefresh
              initialLoading
              hideFilters={{ all: true, tags: false, operatingSystem: false }}
              columns={(defaultColumns) => templateSystemsColumnsMerger(defaultColumns)}
              showTags
              onLoad={({ mergeWithEntities }) => {
                store.replaceReducer(
                  combineReducers({
                    ...defaultReducers,
                    ...mergeWithEntities(
                      inventoryEntitiesReducer(SYSTEMS_LIST_COLUMNS, modifyTemplateDetailSystems),
                      persistantParams({ page, perPage, sort, search }, decodedParams),
                    ),
                  }),
                );
              }}
              customFilters={{
                patchParams: {
                  search,
                  filter,
                  systemProfile,
                  selectedTags,
                },
              }}
              paginationProps={{
                isDisabled: totalItems === 0,
              }}
              getEntities={getEntities}
              bulkSelect={bulkSelectConfig}
              tableProps={{
                canSelectAll: false,
                variant: TableVariant.compact,
                className: 'patchCompactInventory',
                isStickyHeader: true,
                actionResolver: () =>
                  hasAccess ? patchSetDetailRowActions(openSystemUnassignModal) : [],
              }}
              actionsConfig={{
                actions: [
                  '', // intentionally empty, remediation button placeholder
                  {
                    key: 'remove-multiple-systems',
                    label: intl.formatMessage(messages.titlesTemplateRemoveFromSystems, {
                      systemsCount: selectedCount,
                    }),
                    onClick: () =>
                      openSystemUnassignModal(filterSelectedActiveSystemIDs(selectedRows)),
                    props: { isDisabled: selectedCount === 0 },
                  },
                ],
              }}
              filterConfig={filterConfig}
              activeFiltersConfig={activeFiltersConfig}
            />
          )
        ) : (
          <NoAppliedSystems
            hasAccess={hasAccess}
            onButtonClick={() => openPatchSetAssignWizard()}
          />
        )}
      </Main>
    </Fragment>
  );
};

export default PatchSetDetail;

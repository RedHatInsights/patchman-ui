import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { fetchPatchSetsAction, changePatchSetsParams,
    selectPatchSetRow, clearPatchSetsAction } from '../../store/Actions/Actions';
import { deletePatchSet } from '../../Utilities/api';
import { createPatchSetRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams } from '../../Utilities/Helpers';
import {
    setPageTitle, useDeepCompareEffect, useEntitlements, usePerPageSelect, useSetPage, useSortColumn
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { clearNotifications, addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { patchSetColumns, CreatePatchSetButton as createPatchSetButton,
    patchSetRowActions, CustomActionsToggle } from './PatchSetAssets';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';
import { patchSetDeleteNotifications } from '../../Utilities/constants';
import usePatchSetState from '../../Utilities/usePatchSetState';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { useOnSelect, ID_API_ENDPOINTS } from '../../Utilities/useOnSelect';
import { NoSmartManagement } from '../../PresentationalComponents/Snippets/EmptyStates';

const PatchSet = () => {
    const pageTitle = intl.formatMessage(messages.titlesTemplate);

    const IS_SELECTION_ENABLED = false;

    setPageTitle(pageTitle);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [firstMount, setFirstMount] = React.useState(true);
    const [hasSmartManagement, setSmartManagement] = React.useState(true);
    const patchSets = useSelector(
        ({ PatchSetsStore }) => PatchSetsStore.rows
    );

    const queryParams = useSelector(
        ({ PatchSetsStore }) => PatchSetsStore.queryParams
    );
    const selectedRows = useSelector(
        ({ PatchSetsStore }) => PatchSetsStore.selectedRows
    );
    const metadata = useSelector(
        ({ PatchSetsStore }) => PatchSetsStore.metadata
    );
    const status = useSelector(
        ({ PatchSetsStore }) => PatchSetsStore.status
    );

    const rows = useMemo(
        () => createPatchSetRows(patchSets, selectedRows, queryParams),
        [patchSets, selectedRows]
    );

    const getEntitlements = useEntitlements();

    function apply(params) {
        dispatch(changePatchSetsParams(params));
    }

    const refreshTable = () => {
        dispatch(fetchPatchSetsAction({ ...queryParams, page: 1, offset: 0 }));
    };

    useEffect(() => {
        getEntitlements().then((entitelements) => {
            setSmartManagement(
                entitelements?.smart_management?.is_entitled
            );
        });

        return () => {
            dispatch(clearPatchSetsAction());
            dispatch(clearNotifications());
        };
    }, []);

    const { patchSetState, setPatchSetState, openPatchSetEditModal } = usePatchSetState(selectedRows);

    useEffect(() => {
        if (patchSetState.shouldRefresh === true) {
            refreshTable();
        }
    }, [patchSetState.shouldRefresh]);

    useDeepCompareEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams(location.search));
            setFirstMount(false);
        } else {
            navigate(encodeURLParams(queryParams), { replace: true });
            dispatch(fetchPatchSetsAction(queryParams));
        }
    }, [queryParams, firstMount]);

    const onSelect = useOnSelect(
        rows,
        selectedRows,
        {
            endpoint: ID_API_ENDPOINTS.templates,
            queryParams,
            selectionDispatcher: selectPatchSetRow
        }
    );

    const onSort = useSortColumn(patchSetColumns, apply, 0);
    const sortBy = React.useMemo(
        () => createSortBy(patchSetColumns, metadata.sort, 0),
        [metadata.sort]
    );

    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    const handlePatchSetDelete = (rowData) => {
        deletePatchSet(rowData.id).then(() => {
            dispatch(addNotification(patchSetDeleteNotifications.success));
            refreshTable();
        }).catch(() => {
            dispatch(addNotification(patchSetDeleteNotifications.error));
        });;
    };

    const { hasAccess } = usePermissionsWithContext([
        'patch:*:*',
        'patch:template:write'
    ]);
    const CreatePatchSetButton = createPatchSetButton(setPatchSetState, hasAccess);
    const actionsConfig = patchSetRowActions(openPatchSetEditModal, handlePatchSetDelete);

    //TODO: refactor search filter to be able to wrap this into useMemo
    const filterConfig = {
        items: [
            searchFilter(apply, queryParams.search,
                intl.formatMessage(messages.labelsFiltersSearchTemplateTitle),
                intl.formatMessage(messages.labelsFiltersSearchTemplatePlaceholder)
            )
        ]
    };

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesTemplate)} headerOUIA={'advisories'} />
            {patchSetState.isPatchSetWizardOpen &&
                <PatchSetWizard
                    systemsIDs={patchSetState.systemsIDs}
                    setBaselineState={setPatchSetState}
                    patchSetID={patchSetState.patchSetID}
                />}
            <Main>
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
            </Main>
        </React.Fragment>
    );
};

export default PatchSet;

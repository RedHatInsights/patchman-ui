import { Main } from '@redhat-cloud-services/frontend-components/Main';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { fetchPatchSetsAction, changePatchSetParams, selectPatchSetRow } from '../../store/Actions/Actions';
import { fetchPatchSets, deletePatchSet } from '../../Utilities/api';
import { createPatchSetRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams } from '../../Utilities/Helpers';
import {
    setPageTitle, useDeepCompareEffect, useOnSelect, usePerPageSelect, useSetPage, useSortColumn
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { clearNotifications, addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { patchSetColumns, useCreatePatchSetButton, usePatchSetRowActions } from './PatchSetAssets';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';
import { patchSetDeleteNotifications } from '../../Utilities/constants';

const PatchSet = ({ history }) => {
    const pageTitle = intl.formatMessage(messages.titlesAdvisories);

    const IS_SELECTION_ENABLED = false;

    setPageTitle(pageTitle);

    const dispatch = useDispatch();
    const [firstMount, setFirstMount] = React.useState(true);
    const [patchSetState, setBaselineState] = React.useState({
        isOpen: false,
        patchSetID: undefined,
        systemsIDs: []
    });

    const patchSet = useSelector(
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

    const rows = React.useMemo(
        () => createPatchSetRows(patchSet, selectedRows, queryParams),
        [patchSet, selectedRows]
    );

    React.useEffect(() => {
        return () => {
            dispatch(clearNotifications());
        };
    }, []);

    useDeepCompareEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams(history.location.search));
            setFirstMount(false);
        } else {
            history.push(encodeURLParams(queryParams));
            dispatch(fetchPatchSetsAction(queryParams));
        }
    }, [queryParams, firstMount]);

    const fetchAllData = () =>
        fetchPatchSets({ ...queryParams, limit: -1 });

    const selectRows = (toSelect) => {
        dispatch(
            selectPatchSetRow(toSelect)
        );
    };

    const onSelect = useOnSelect(rows, selectedRows, fetchAllData, selectRows, (patchSet) => patchSet.id);

    const onSort = useSortColumn(patchSetColumns, apply, 2);
    const sortBy = React.useMemo(
        () => createSortBy(patchSetColumns, metadata.sort, 2),
        [metadata.sort]
    );

    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    function apply(params) {
        dispatch(changePatchSetParams(params));
    }

    async function showBaselineModal(rowData) {
        setBaselineState({ isOpen: true, patchSetID: rowData.id });
    }

    const handlePatchSetDelete = (rowData) => {
        deletePatchSet(rowData.id).then(() => {
            dispatch(addNotification(patchSetDeleteNotifications.success));
            apply({ page: 1, offset: 0 });
        }).catch(() => {
            dispatch(addNotification(patchSetDeleteNotifications.error));
        });;
    };

    const CreatePatchSet = useCreatePatchSetButton(setBaselineState);
    const patchSetRowActions = usePatchSetRowActions(showBaselineModal, handlePatchSetDelete);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSet)} headerOUIA={'advisories'} />
            {patchSetState.isOpen &&
                <PatchSetWizard
                    systemsIDs={patchSetState.systemsIDs}
                    setBaselineState={setBaselineState}
                    patchSetID={patchSetState.patchSetID}
                />}
            <Main>
                <TableView
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
                    actionsConfig={patchSetRowActions}
                    filterConfig={{
                        items: [
                            searchFilter(apply, queryParams.search,
                                intl.formatMessage(messages.labelsFiltersSearchPatchSetTitle),
                                intl.formatMessage(messages.labelsFiltersSearchPatchSetPlaceholder)
                            )
                        ]
                    }}
                    searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchPatchSetTitle)}
                    CreatePatchSet={CreatePatchSet}
                />
            </Main>
        </React.Fragment>
    );
};

PatchSet.propTypes = {
    history: propTypes.object
};

export default withRouter(PatchSet);

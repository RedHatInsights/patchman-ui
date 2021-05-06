import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import messages from '../../Messages';
import publishDateFilter from '../../PresentationalComponents/Filters/PublishDateFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import typeFilter from '../../PresentationalComponents/Filters/TypeFilter';
import Header from '../../PresentationalComponents/Header/Header';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { advisoriesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import {
    changeAdvisoryListParams, expandAdvisoryRow,
    fetchApplicableAdvisories, selectAdvisoryRow
} from '../../store/Actions/Actions';
import {
    exportAdvisoriesCSV, exportAdvisoriesJSON, fetchApplicableAdvisoriesApi,
    fetchSystems, fetchViewAdvisoriesSystems
} from '../../Utilities/api';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import {
    arrayFromObj, createSortBy, decodeQueryparams,
    encodeURLParams, getRowIdByIndexExpandable, remediationProviderWithPairs, transformPairs
} from '../../Utilities/Helpers';
import { setPageTitle, useOnSelect, usePerPageSelect, useSetPage, useSortColumn } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';

const Advisories = ({ history }) => {
    const pageTitle = intl.formatMessage(messages.titlesAdvisories);

    setPageTitle(pageTitle);

    const dispatch = useDispatch();
    const [firstMount, setFirstMount] = React.useState(true);
    const advisories = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.rows
    );

    const expandedRows = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.expandedRows
    );
    const queryParams = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.queryParams
    );
    const selectedRows = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.selectedRows
    );
    const metadata = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.metadata
    );
    const status = useSelector(
        ({ AdvisoryListStore }) => AdvisoryListStore.status
    );

    const rows = React.useMemo(
        () => createAdvisoriesRows(advisories, expandedRows, selectedRows),
        [advisories, expandedRows, selectedRows]
    );

    React.useEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams(history.location.search));
            setFirstMount(false);
        } else {
            history.push(encodeURLParams(queryParams));
            dispatch(fetchApplicableAdvisories(queryParams));
        }
    }, [queryParams]);

    const onCollapse = React.useCallback((_, rowId, value) =>
        dispatch(
            expandAdvisoryRow({
                rowId: getRowIdByIndexExpandable(advisories, rowId),
                value
            })
        )
    );

    const fetchAllData = () =>
        fetchApplicableAdvisoriesApi({ ...queryParams, limit: -1 });

    const selectRows = (toSelect) => {
        dispatch(
            selectAdvisoryRow(toSelect)
        );
    };

    const onSelect = useOnSelect(rows, selectedRows, fetchAllData, selectRows, (advisory) => advisory.id);

    const onSort = useSortColumn(advisoriesColumns, apply, 2);
    const sortBy = React.useMemo(
        () => createSortBy(advisoriesColumns, metadata.sort, 2),
        [metadata.sort]
    );

    const onExport = (_, format) => {
        const date = new Date().toISOString().replace(/[T:]/g, '-').split('.')[0] + '-utc';
        const filename = `applicable-advisories-${date}`;
        if (format === 'csv') {
            exportAdvisoriesCSV(queryParams).then(data => downloadFile(data, filename, 'csv'));
        }
        else {
            exportAdvisoriesJSON(queryParams).then(data => downloadFile(JSON.stringify(data), filename, 'json'));
        }
    };

    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    function apply(params) {
        dispatch(changeAdvisoryListParams(params));
    }

    const prepareRemediationPairs = (issues) => {
        return fetchSystems({ limit: -1 }).then(
            ({ data }) => fetchViewAdvisoriesSystems(
                {
                    advisories: issues,
                    systems: data.map(system => system.id)
                }
            ));
    };

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchAdvisories)} headerOUIA={'advisories'}/>
            <Main>
                <TableView
                    columns={advisoriesColumns}
                    compact
                    onCollapse={onCollapse}
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    onSort={onSort}
                    onExport={onExport}
                    selectedRows={selectedRows}
                    onSelect={onSelect}
                    sortBy={sortBy}
                    remediationProvider={() =>
                        remediationProviderWithPairs(arrayFromObj(selectedRows), prepareRemediationPairs, transformPairs)
                    }
                    apply={apply}
                    remediationButtonOUIA={'toolbar-remediation-button'}
                    tableOUIA={'advisories-table'}
                    paginationOUIA={'advisories-pagination'}
                    store={{ rows, metadata, status, queryParams }}
                    filterConfig={{
                        items: [
                            searchFilter(apply, queryParams.search,
                                intl.formatMessage(messages.labelsFiltersSearchAdvisoriesTitle),
                                intl.formatMessage(messages.labelsFiltersSearchAdvisoriesPlaceholder)
                            ),
                            typeFilter(apply, queryParams.filter),
                            publishDateFilter(apply, queryParams.filter)
                        ]
                    }}
                />
            </Main>
        </React.Fragment>
    );
};

Advisories.propTypes = {
    history: propTypes.object
};

export default withRouter(Advisories);

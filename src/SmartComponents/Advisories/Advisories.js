import { Main } from '@redhat-cloud-services/frontend-components/Main';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import messages from '../../Messages';
import publishDateFilter from '../../PresentationalComponents/Filters/PublishDateFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import typeFilter from '../../PresentationalComponents/Filters/TypeFilter';
import rebootFilter from '../../PresentationalComponents/Filters/RebootFilter';
import Header from '../../PresentationalComponents/Header/Header';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { advisoriesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import {
    changeAdvisoryListParams, expandAdvisoryRow,
    fetchApplicableAdvisories, selectAdvisoryRow
} from '../../store/Actions/Actions';
import {
    exportAdvisoriesCSV, exportAdvisoriesJSON, fetchApplicableAdvisoriesApi
} from '../../Utilities/api';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import {
    createSortBy, decodeQueryparams,
    encodeURLParams, getRowIdByIndexExpandable
} from '../../Utilities/Helpers';
import {
    setPageTitle, useDeepCompareEffect, useOnExport,
    useOnSelect, usePerPageSelect, useSetPage, useSortColumn
} from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';
import AdvisoriesStatusReport from '../../PresentationalComponents/StatusReports/AdvisoriesStatusReport';
import useRemediationProvier from '../../Utilities/useRemediationDataProvider';
import { prepareRemediationPairs } from './AdvisoriesHelper';

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

    const [isRemediationLoading, setRemediationLoading] = React.useState(false);

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
            dispatch(fetchApplicableAdvisories(queryParams));
        }
    }, [queryParams, firstMount]);

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

    const onExport = useOnExport('advisories', queryParams, {
        csv: exportAdvisoriesCSV,
        json: exportAdvisoriesJSON
    }, dispatch);

    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    function apply(params) {
        dispatch(changeAdvisoryListParams(params));
    }

    const remediationDataProvider = useRemediationProvier(selectedRows, setRemediationLoading, prepareRemediationPairs);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchAdvisories)} headerOUIA={'advisories'} />
            <AdvisoriesStatusReport/>
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
                    remediationProvider={remediationDataProvider}
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
                            publishDateFilter(apply, queryParams.filter),
                            rebootFilter(apply, queryParams.filter)
                        ]
                    }}
                    searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchAdvisoriesTitle)}
                    isRemediationLoading={isRemediationLoading}
                />
            </Main>
        </React.Fragment>
    );
};

Advisories.propTypes = {
    history: propTypes.object
};

export default withRouter(Advisories);

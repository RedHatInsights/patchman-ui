import { Main } from '@redhat-cloud-services/frontend-components';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import publishDateFilter from '../../PresentationalComponents/Filters/PublishDateFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import typeFilter from '../../PresentationalComponents/Filters/TypeFilter';
import Header from '../../PresentationalComponents/Header/Header';
import { Unavailable } from '@redhat-cloud-services/frontend-components';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { advisoriesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changeAdvisoryListParams, expandAdvisoryRow, fetchApplicableAdvisories } from '../../store/Actions/Actions';
import { exportAdvisoriesCSV, exportAdvisoriesJSON } from '../../Utilities/api';
import { STATUS_REJECTED } from '../../Utilities/constants';
import { createAdvisoriesRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams, getRowIdByIndexExpandable } from '../../Utilities/Helpers';
import { usePerPageSelect, useSetPage, useSortColumn, setPageTitle } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

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

    const onSort = useSortColumn(advisoriesColumns, apply, 1);
    const sortBy = React.useMemo(
        () => createSortBy(advisoriesColumns, metadata.sort, 1),
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

    const errorState  = status === STATUS_REJECTED && <Unavailable />;

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
                    sortBy={sortBy}
                    apply={apply}
                    remediationButtonOUIA={'toolbar-remediation-button'}
                    tableOUIA={'advisories-table'}
                    paginationOUIA={'advisories-pagination'}
                    store={{ rows, metadata, status, queryParams }}
                    filterConfig={{
                        items: [
                            searchFilter(apply, queryParams.search),
                            typeFilter(apply, queryParams.filter),
                            publishDateFilter(apply, queryParams.filter)
                        ]
                    }}
                    errorState={errorState}
                />
            </Main>
        </React.Fragment>
    );
};

Advisories.propTypes = {
    history: propTypes.object
};

export default withRouter(Advisories);

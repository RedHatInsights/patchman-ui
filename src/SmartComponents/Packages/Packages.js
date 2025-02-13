import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../Messages';
import packagesListStatusFilter from '../../PresentationalComponents/Filters/PackagesListStatusFilter';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import Header from '../../PresentationalComponents/Header/Header';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { packagesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { changePackagesListParams, fetchPackagesAction } from '../../store/Actions/Actions';
import { exportPackagesCSV, exportPackagesJSON } from '../../Utilities/api';
import { packagesListDefaultFilters } from '../../Utilities/constants';
import { createPackagesRows } from '../../Utilities/DataMappers';
import { createSortBy, decodeQueryparams, encodeURLParams } from '../../Utilities/Helpers';
import { useOnExport, usePerPageSelect,
    useSetPage, useSortColumn, useDeepCompareEffect } from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useSearchParams } from 'react-router-dom';

const Packages = () => {
    const dispatch = useDispatch();
    const [firstMount, setFirstMount] = React.useState(true);
    const chrome = useChrome();
    useEffect(()=>{
        chrome.updateDocumentTitle(`Packages - Content | RHEL`, true);
    }, [chrome]);

    const [searchParams, setSearchParams] = useSearchParams();
    const packageRows = useSelector(
        ({ PackagesListStore }) => PackagesListStore.rows
    );
    const rows = React.useMemo(() => createPackagesRows(packageRows), [packageRows]);

    const status = useSelector(
        ({ PackagesListStore }) => PackagesListStore.status
    );
    const metadata = useSelector(
        ({ PackagesListStore }) => PackagesListStore.metadata
    );
    const queryParams = useSelector(
        ({ PackagesListStore }) => PackagesListStore.queryParams
    );

    useDeepCompareEffect(() => {
        if (firstMount) {
            apply(decodeQueryparams('?' + searchParams.toString()));
            setFirstMount(false);
        } else {
            setSearchParams(encodeURLParams(queryParams));
            dispatch(fetchPackagesAction(queryParams));
        }
    }, [queryParams, firstMount]);

    function apply(params) {
        dispatch(changePackagesListParams(params));
    }

    const onExport = useOnExport('packages', queryParams, {
        csv: exportPackagesCSV,
        json: exportPackagesJSON
    }, dispatch);

    const onSort = useSortColumn(packagesColumns, apply);
    const sortBy = React.useMemo(
        () => createSortBy(packagesColumns, metadata.sort, 0),
        [metadata.sort]
    );
    const onSetPage = useSetPage(metadata.limit, apply);
    const onPerPageSelect = usePerPageSelect(apply);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchPackages)} headerOUIA={'packages'} />
            <Main>
                <TableView
                    columns={packagesColumns}
                    store={{ rows, metadata, status, queryParams }}
                    onSort={onSort}
                    onExport={onExport}
                    sortBy={sortBy}
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    compact
                    apply={apply}
                    filterConfig={{
                        items: [
                            searchFilter(apply, queryParams.search,
                                intl.formatMessage(messages.labelsFiltersPackagesSearchTitle),
                                intl.formatMessage(messages.labelsFiltersPackagesSearchPlaceHolder)
                            ),
                            packagesListStatusFilter(apply, queryParams.filter)
                        ]
                    }}
                    remediationButtonOUIA={'toolbar-remediation-button'}
                    tableOUIA={'package-details-table'}
                    paginationOUIA={'package-details-pagination'}
                    defaultFilters={packagesListDefaultFilters}
                    searchChipLabel={intl.formatMessage(messages.labelsFiltersPackagesSearchTitle)}
                    hasColumnManagement
                />
            </Main>
        </React.Fragment>
    );
};

export default Packages;

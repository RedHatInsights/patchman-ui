import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import {
    Table,
    TableBody,
    TableHeader
} from '@patternfly/react-table/dist/js/components/Table';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/PrimaryToolbar';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/components/SkeletonTable';
import PropTypes from 'prop-types';
import React from 'react';
import RemediationModal from '../../SmartComponents/Remediation/RemediationModal';
import {
    arrayFromObj,
    convertLimitOffset,
    createSortBy
} from '../../Utilities/Helpers';
import publishDateFilter from '../Filters/PublishDateFilter';
import searchFilter from '../Filters/SearchFilter';
import typeFilter from '../Filters/TypeFilter';
import TableFooter from './TableFooter';

const AdvisoriesTable = ({
    columns,
    rows,
    onCollapse,
    onSelect,
    onSetPage,
    onPerPageSelect,
    onSort,
    metadata,
    isLoading,
    remediationProvider,
    selectedRows,
    apply
}) => {
    const [
        RemediationModalCmp,
        setRemediationModalCmp
    ] = React.useState(() => () => null);
    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(metadata.limit, metadata.offset),
        [metadata.limit, metadata.offset]
    );
    const sortBy = React.useMemo(
        () => createSortBy(columns, metadata.sort, 2),
        [metadata.sort]
    );
    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    return (
        <React.Fragment>
            <PrimaryToolbar
                pagination={{
                    itemCount: metadata.total_items,
                    page,
                    perPage,
                    isCompact: false,
                    onSetPage,
                    onPerPageSelect
                }}
                filterConfig={{
                    items: [
                        searchFilter(apply),
                        typeFilter(apply),
                        publishDateFilter(apply)
                    ]
                }}
            >
                {remediationProvider && (
                    <React.Fragment>
                        <Button
                            isDisabled={arrayFromObj(selectedRows).length === 0}
                            onClick={() =>
                                showRemediationModal(remediationProvider())
                            }
                        >
                            Apply
                        </Button>
                        <RemediationModalCmp />
                    </React.Fragment>
                )}
            </PrimaryToolbar>
            {isLoading ? (
                <SkeletonTable colSize={5} rowSize={20} />
            ) : (
                <React.Fragment>
                    <Table
                        aria-label="Advisories table"
                        cells={columns}
                        onSelect={onSelect}
                        rows={rows}
                        onCollapse={onCollapse}
                        canSelectAll={false}
                        onSort={onSort}
                        sortBy={sortBy}
                    >
                        <TableHeader />
                        <TableBody />
                    </Table>
                    <TableFooter
                        totalItems={metadata.total_items}
                        perPage={perPage}
                        page={page}
                        onSetPage={onSetPage}
                    />
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

AdvisoriesTable.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    onCollapse: PropTypes.func,
    onSelect: PropTypes.func,
    onSetPage: PropTypes.func,
    onPerPageSelect: PropTypes.func,
    onSort: PropTypes.func,
    metadata: PropTypes.object,
    isLoading: PropTypes.bool,
    remediationProvider: PropTypes.func,
    selectedRows: PropTypes.object,
    apply: PropTypes.func
};

export default AdvisoriesTable;

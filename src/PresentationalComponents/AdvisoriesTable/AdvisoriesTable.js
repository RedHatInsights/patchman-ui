import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import {
    PrimaryToolbar,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import PropTypes from 'prop-types';
import React from 'react';
import Remediation from '../../SmartComponents/Remediation/Remediation';
import { convertLimitOffset, createSortBy } from '../../Utilities/Helpers';
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
    systemId
}) => {
    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(metadata.limit, metadata.offset),
        [metadata.limit, metadata.offset]
    );
    const sortBy = React.useMemo(
        () => createSortBy(columns, metadata.sort, 2),
        [metadata.sort]
    );
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
                filterConfig={{ items: [] }}
            >
                {remediationProvider && (
                    <Remediation
                        remediationProvider={remediationProvider}
                        systemId={systemId}
                    />
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
    systemId: PropTypes.string
};

export default AdvisoriesTable;

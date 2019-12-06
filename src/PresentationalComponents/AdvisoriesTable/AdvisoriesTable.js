import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import PropTypes from 'prop-types';
import React from 'react';
import { convertLimitOffset } from '../../Utilities/Helpers';

const AdvisoriesTable = ({
    columns,
    rows,
    onCollapse,
    onSelect,
    onSetPage,
    onPerPageSelect,
    metadata
}) => {
    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(metadata.limit, metadata.offset),
        [metadata.limit, metadata.offset]
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
            />
            <Table
                aria-label="Advisories table"
                cells={columns}
                onSelect={onSelect}
                rows={rows}
                onCollapse={onCollapse}
            >
                <TableHeader />
                <TableBody />
            </Table>
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
    metadata: PropTypes.object
};

export default AdvisoriesTable;

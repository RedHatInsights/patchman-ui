import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import PropTypes from 'prop-types';
import React from 'react';

const AdvisoriesTable = ({ columns, rows, onCollapse }) => {
    return (
        <Table
            aria-label="Advisories table"
            cells={columns}
            rows={rows}
            onCollapse={onCollapse}
        >
            <TableHeader />
            <TableBody />
        </Table>
    );
};

AdvisoriesTable.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    onCollapse: PropTypes.func
};

export default AdvisoriesTable;

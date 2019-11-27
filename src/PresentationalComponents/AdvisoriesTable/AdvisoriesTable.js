import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import React from 'react';
import PropTypes from 'prop-types';

const AdvisoriesTable = ({ columns, rows }) => {
    return (
        <Table aria-label="Simple Table" cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
        </Table>
    );
};

AdvisoriesTable.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array
};

export default AdvisoriesTable;

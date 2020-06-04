import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import AnsibeTowerIcon from '@patternfly/react-icons/dist/js/icons/ansibeTower-icon'; // PF typo
import { Table, TableBody, TableHeader } from '@patternfly/react-table/dist/js/components/Table';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/PrimaryToolbar';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/components/cjs/SkeletonTable';
import PropTypes from 'prop-types';
import React from 'react';
import RemediationModal from '../../SmartComponents/Remediation/RemediationModal';
import { STATUS_LOADING, STATUS_RESOLVED } from '../../Utilities/constants';
import { arrayFromObj, buildFilterChips, convertLimitOffset } from '../../Utilities/Helpers';
import { useRemoveFilter } from '../../Utilities/Hooks';
import publishDateFilter from '../Filters/PublishDateFilter';
import searchFilter from '../Filters/SearchFilter';
import typeFilter from '../Filters/TypeFilter';
import TableFooter from './TableFooter';

const AdvisoriesTable = ({
    columns,
    store: {
        rows,
        metadata,
        status,
        queryParams: { filter, search }
    },
    onCollapse,
    onSelect,
    onSetPage,
    onPerPageSelect,
    onSort,
    onExport,
    sortBy,
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

    const showRemediationModal = data => {
        setRemediationModalCmp(() => () => <RemediationModal data={data} />);
    };

    const removeFilter = useRemoveFilter(filter, apply);
    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;
    return (
        <React.Fragment>
            <PrimaryToolbar
                pagination={{
                    itemCount: metadata.total_items,
                    page,
                    perPage,
                    isCompact: true,
                    onSetPage,
                    onPerPageSelect
                }}
                filterConfig={{
                    items: [
                        searchFilter(apply, search),
                        typeFilter(apply, filter),
                        publishDateFilter(apply, filter)
                    ]
                }}
                activeFiltersConfig={{
                    filters: buildFilterChips(filter, search),
                    onDelete: removeFilter
                }}
                actionsConfig={{ actions: [remediationProvider && (
                    <React.Fragment>
                        <Button
                            isDisabled={selectedCount === 0}
                            onClick={() =>
                                showRemediationModal(remediationProvider())
                            }
                        >
                            <AnsibeTowerIcon/>&nbsp;Remediate
                        </Button>
                        <RemediationModalCmp />
                    </React.Fragment>
                )] }}
                exportConfig={{ onSelect: onExport }}
                bulkSelect={onSelect && {
                    count: selectedCount,
                    items: [{
                        title: `Select none (0)`,
                        onClick: () => {
                            onSelect('none');
                        }
                    }, {
                        title: `Select page (${rows.length / 2})`,
                        onClick: () => {
                            onSelect('page');
                        }
                    },
                    {
                        title: `Select all (${metadata.total_items})`,
                        onClick: () => {
                            onSelect('all');
                        }
                    }],
                    onSelect: (value) => {
                        value ? onSelect('all') : onSelect('none');
                    },
                    checked: selectedCount === metadata.total_items ? true : selectedCount === 0 ? false : null
                }}

            />

            {status === STATUS_LOADING && <SkeletonTable colSize={5} rowSize={20} />}
            {status === STATUS_RESOLVED && (
                <React.Fragment>
                    <Table
                        aria-label="Advisories table"
                        cells={metadata.total_items && columns || ['']}
                        onSelect={onSelect}
                        rows={rows}
                        onCollapse={metadata.total_items && onCollapse}
                        canSelectAll={false}
                        onSort={onSort}
                        sortBy={metadata.total_items && sortBy}
                    >
                        <TableHeader />
                        <TableBody />
                    </Table>
                    <TableFooter
                        totalItems={metadata.total_items}
                        perPage={perPage}
                        page={page}
                        onSetPage={onSetPage}
                        onPerPageSelect={onPerPageSelect}
                    />
                </React.Fragment>)}
        </React.Fragment>
    );
};

AdvisoriesTable.propTypes = {
    columns: PropTypes.array,
    onCollapse: PropTypes.func,
    onSelect: PropTypes.func,
    onSetPage: PropTypes.func,
    onPerPageSelect: PropTypes.func,
    onSort: PropTypes.func,
    onExport: PropTypes.func,
    remediationProvider: PropTypes.func,
    selectedRows: PropTypes.object,
    apply: PropTypes.func,
    sortBy: PropTypes.object,
    store: PropTypes.object
};

export default AdvisoriesTable;

import { Button } from '@patternfly/react-core';
import { AnsibeTowerIcon } from '@patternfly/react-icons'; // PF typo
import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { PrimaryToolbar, SkeletonTable } from '@redhat-cloud-services/frontend-components';
import globalPaletteWhite from '@patternfly/react-tokens/dist/js/global_palette_white';
import PropTypes from 'prop-types';
import React from 'react';
import RemediationModal from '../../SmartComponents/Remediation/RemediationModal';
import { STATUS_LOADING, STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import { arrayFromObj, buildFilterChips, convertLimitOffset } from '../../Utilities/Helpers';
import { useRemoveFilter } from '../../Utilities/Hooks';
import TableFooter from './TableFooter';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const TableView = ({
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
    filterConfig,
    sortBy,
    remediationProvider,
    selectedRows,
    compact,
    apply,
    remediationButtonOUIA,
    tableOUIA,
    paginationOUIA,
    errorState,
    emptyState
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
            {
                (status === STATUS_REJECTED) && errorState ||
                (status === STATUS_RESOLVED && emptyState !== false) && emptyState ||
                (<React.Fragment>
                    <PrimaryToolbar
                        pagination={{
                            itemCount: metadata.total_items,
                            page,
                            perPage,
                            isCompact: true,
                            onSetPage,
                            onPerPageSelect,
                            ouiaId: `top-${paginationOUIA}`
                        }}
                        filterConfig={filterConfig}
                        activeFiltersConfig={{
                            filters: buildFilterChips(filter, search),
                            onDelete: removeFilter
                        }}
                        actionsConfig={{ actions: [remediationProvider && (
                            <React.Fragment>
                                <Button
                                    isDisabled={selectedCount === 0}
                                    className={'remediationButtonPatch'}
                                    onClick={() =>
                                        showRemediationModal(remediationProvider())
                                    }
                                    ouiaId={remediationButtonOUIA}
                                >
                                    <AnsibeTowerIcon color={globalPaletteWhite.value} />&nbsp;Remediate
                                </Button>
                                <RemediationModalCmp />
                            </React.Fragment>
                        )] }}
                        exportConfig={{ onSelect: onExport }}
                        bulkSelect={onSelect && {
                            count: selectedCount,
                            items: [{
                                title: intl.formatMessage(messages.labelsBulkSelectNone),
                                onClick: () => {
                                    onSelect('none');
                                }
                            }, {
                                title: intl.formatMessage(messages.labelsBulkSelectPage,
                                    { count: onCollapse && rows.length / 2 || rows.length }
                                ),
                                onClick: () => {
                                    onSelect('page');
                                }
                            },
                            {
                                title: intl.formatMessage(messages.labelsBulkSelectAll, { count: metadata.total_items }),
                                onClick: () => {
                                    onSelect('all');
                                }
                            }],
                            onSelect: (value) => {
                                value ? onSelect('all') : onSelect('none');
                            },
                            toggleProps: {
                                'data-ouia-component-type': 'bulk-select-toggle-button'
                            },
                            checked: selectedCount === metadata.total_items ? true : selectedCount === 0 ? false : null
                        }}

                    />

                    {status === STATUS_LOADING && <SkeletonTable colSize={5} rowSize={20} />}
                    {status === STATUS_RESOLVED && (
                        <React.Fragment>
                            <Table
                                aria-label="Patch table view"
                                cells={metadata.total_items && columns || ['']}
                                onSelect={onSelect}
                                rows={rows}
                                onCollapse={metadata.total_items && onCollapse}
                                canSelectAll={false}
                                onSort={onSort}
                                ouiaId={tableOUIA}
                                sortBy={metadata.total_items && sortBy}
                                variant={compact && TableVariant.compact}
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
                                paginationOUIA={`bottom-${paginationOUIA}`}
                            />
                        </React.Fragment>)}
                </React.Fragment>)
            }
        </React.Fragment>
    );
};

TableView.propTypes = {
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
    filterConfig: PropTypes.object,
    store: PropTypes.object,
    compact: PropTypes.bool,
    remediationButtonOUIA: PropTypes.string,
    tableOUIA: PropTypes.string,
    paginationOUIA: PropTypes.string,
    errorState: PropTypes.any,
    emptyState: PropTypes.any
};

export default TableView;

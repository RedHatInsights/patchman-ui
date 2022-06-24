import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import PropTypes from 'prop-types';
import React from 'react';
import messages from '../../Messages';
import AsyncRemediationButton from '../../SmartComponents/Remediation/AsyncRemediationButton';
import { arrayFromObj, buildFilterChips, convertLimitOffset } from '../../Utilities/Helpers';
import { useRemoveFilter, useBulkSelectConfig } from '../../Utilities/Hooks';
import { intl } from '../../Utilities/IntlProvider';
import TableFooter from './TableFooter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { ToolbarItem } from '@patternfly/react-core';

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
    tableOUIA,
    paginationOUIA,
    errorState,
    emptyState,
    defaultFilters,
    searchChipLabel,
    CreatePatchSet,
    EditPatchSet,
    actionsConfig
}) => {

    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(metadata.limit, metadata.offset),
        [metadata.limit, metadata.offset]
    );

    const [deleteFilters] = useRemoveFilter(filter, apply, defaultFilters);
    const selectedCount = selectedRows && arrayFromObj(selectedRows).length;
    const { code, hasError, isLoading } = status;

    return (
        <React.Fragment>
            {
                (<React.Fragment>
                    { hasError && <ErrorHandler code={code} ErrorState={errorState} EmptyState={emptyState} />
                        || <React.Fragment>
                            <PrimaryToolbar
                                pagination={{
                                    itemCount: metadata.total_items,
                                    page,
                                    perPage,
                                    isCompact: true,
                                    onSetPage,
                                    onPerPageSelect,
                                    ouiaId: `top-${paginationOUIA}`,
                                    isDisabled: metadata.total_items === 0
                                }}
                                filterConfig={filterConfig}
                                activeFiltersConfig={{
                                    filters: buildFilterChips(filter, search, searchChipLabel),
                                    onDelete: deleteFilters,
                                    deleteTitle: intl.formatMessage(defaultFilters
                                && messages.labelsFiltersReset || messages.labelsFiltersClear)
                                }}
                                actionsConfig={{
                                    actions: [remediationProvider && (
                                        <AsyncRemediationButton
                                            remediationProvider={remediationProvider}
                                            isDisabled={
                                                Object.values(selectedRows).filter(isSelected => isSelected).length === 0
                                            } />
                                    )]
                                }}
                                exportConfig={{
                                    isDisabled: metadata.total_items === 0,
                                    onSelect: onExport
                                }}
                                bulkSelect={onSelect && useBulkSelectConfig(selectedCount, onSelect, metadata, rows, onCollapse)}

                            >
                                { CreatePatchSet && <ToolbarItem>
                                    <CreatePatchSet />
                                </ToolbarItem>}
                                { EditPatchSet && <ToolbarItem>
                                    <EditPatchSet />
                                </ToolbarItem>}
                            </PrimaryToolbar>
                            {isLoading ? <SkeletonTable colSize={5} rowSize={20} /> :
                                <><Table
                                    aria-label="Patch table view"
                                    cells={columns}
                                    onSelect={metadata.total_items && onSelect}
                                    rows={rows}
                                    onCollapse={metadata.total_items && onCollapse}
                                    canSelectAll={false}
                                    onSort={metadata.total_items && onSort}
                                    ouiaId={tableOUIA}
                                    sortBy={metadata.total_items && sortBy}
                                    isStickyHeader
                                    variant={compact && TableVariant.compact}
                                    actions={actionsConfig}
                                >
                                    <TableHeader />
                                    <TableBody />
                                </Table><TableFooter
                                    totalItems={metadata.total_items}
                                    perPage={perPage}
                                    page={page}
                                    onSetPage={onSetPage}
                                    onPerPageSelect={onPerPageSelect}
                                    paginationOUIA={`bottom-${paginationOUIA}`} />
                                </>}
                        </React.Fragment>
                    }
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
    tableOUIA: PropTypes.string,
    paginationOUIA: PropTypes.string,
    errorState: PropTypes.element,
    emptyState: PropTypes.element,
    defaultFilters: PropTypes.object,
    searchChipLabel: PropTypes.string,
    CreatePatchSet: PropTypes.element,
    EditPatchSet: PropTypes.element,
    actionsConfig: PropTypes.array
};

export default TableView;

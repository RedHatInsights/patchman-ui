import { TableVariant } from '@patternfly/react-table';
import { Table, TableBody, TableHeader } from '@patternfly/react-table/deprecated';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import PropTypes from 'prop-types';
import React from 'react';
import messages from '../../Messages';
import AsyncRemediationButton from '../../SmartComponents/Remediation/AsyncRemediationButton';
import { arrayFromObj, buildFilterChips, convertLimitOffset } from '../../Utilities/Helpers';
import { useRemoveFilter, useBulkSelectConfig } from '../../Utilities/hooks';
import { intl } from '../../Utilities/IntlProvider';
import TableFooter from './TableFooter';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import { Skeleton, ToolbarItem } from '@patternfly/react-core';
import { ColumnManagementModal } from '@patternfly/react-component-groups';

const TableView = ({
  columns,
  store: { rows, metadata, status, queryParams: { filter = {}, search = '' } = {} },
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
  ToolbarButton,
  actionsConfig,
  isRemediationLoading,
  actionsToggle,
  hasColumnManagement,
}) => {
  const [page, perPage] = React.useMemo(
    () => convertLimitOffset(metadata.limit, metadata.offset),
    [metadata.limit, metadata.offset],
  );

  const [deleteFilters] = useRemoveFilter(filter, apply, defaultFilters);
  const selectedCount = selectedRows && arrayFromObj(selectedRows).length;
  const { code, hasError, isLoading } = status;
  const bulkSelectConfig = useBulkSelectConfig(selectedCount, onSelect, metadata, rows, onCollapse);

  const [isColumnMgmtModalOpen, setColumnMgmtModalOpen] = React.useState(false);
  const [appliedColumns, setAppliedColumns] = React.useState(columns);

  const shownColumns = hasColumnManagement
    ? appliedColumns?.filter((column) => column.isShown)
    : columns;

  // remove cells correspoding to hidden columns from table rows
  const slicedRows = hasColumnManagement
    ? rows.map((row) =>
        row.parent
          ? row // rows with parent are expandible cells and should't be affected by column mgmt
          : { ...row, cells: row.cells.filter((_, index) => appliedColumns[index].isShown) },
      )
    : rows;

  return (
    <React.Fragment>
      <ColumnManagementModal
        appliedColumns={appliedColumns}
        applyColumns={(newColumns) => setAppliedColumns(newColumns)}
        isOpen={isColumnMgmtModalOpen}
        onClose={() => setColumnMgmtModalOpen(false)}
      />
      {hasError || metadata.has_systems === false ? (
        <ErrorHandler
          code={code}
          ErrorState={errorState}
          EmptyState={emptyState}
          metadata={metadata}
        />
      ) : (
        <React.Fragment>
          <PrimaryToolbar
            pagination={
              isLoading ? (
                <Skeleton fontSize='xl' width='200px' style={{ margin: 10 }} />
              ) : (
                {
                  itemCount: metadata.total_items,
                  page,
                  perPage,
                  isCompact: true,
                  onSetPage,
                  onPerPageSelect,
                  ouiaId: `top-${paginationOUIA}`,
                  isDisabled: metadata.total_items === 0,
                }
              )
            }
            filterConfig={filterConfig}
            activeFiltersConfig={{
              filters: buildFilterChips(filter, search, searchChipLabel),
              onDelete: deleteFilters,
              deleteTitle: intl.formatMessage(
                (defaultFilters && messages.labelsFiltersReset) || messages.labelsFiltersClear,
              ),
            }}
            actionsConfig={{
              actions: [
                remediationProvider && (
                  <AsyncRemediationButton
                    remediationProvider={remediationProvider}
                    isDisabled={
                      Object.values(selectedRows).filter((isSelected) => isSelected).length === 0 ||
                      isRemediationLoading
                    }
                    isLoading={isRemediationLoading}
                    hasSelected={
                      Object.values(selectedRows).filter((isSelected) => isSelected).length > 0
                    }
                  />
                ),
                ...(hasColumnManagement
                  ? [
                      {
                        label: 'Manage columns',
                        onClick: () => setColumnMgmtModalOpen(true),
                      },
                    ]
                  : []),
              ],
            }}
            exportConfig={{
              isDisabled: metadata.total_items === 0,
              onSelect: onExport,
            }}
            bulkSelect={onSelect && bulkSelectConfig}
          >
            {ToolbarButton && (
              <ToolbarItem>
                <ToolbarButton />
              </ToolbarItem>
            )}
          </PrimaryToolbar>
          {isLoading ? (
            <SkeletonTable
              numberOfColumns={shownColumns?.length ?? 5}
              rows={20}
              variant={compact && TableVariant.compact}
            />
          ) : (
            <Table
              aria-label='Patch table view'
              cells={shownColumns}
              onSelect={metadata.total_items && onSelect}
              rows={slicedRows}
              onCollapse={metadata.total_items && onCollapse}
              canSelectAll={false}
              onSort={metadata.total_items && onSort}
              ouiaId={tableOUIA}
              sortBy={metadata.total_items && sortBy}
              isStickyHeader
              variant={compact && TableVariant.compact}
              actions={actionsConfig}
              actionsToggle={actionsToggle}
            >
              <TableHeader />
              <TableBody />
            </Table>
          )}
          <TableFooter
            isLoading={isLoading}
            totalItems={metadata.total_items}
            perPage={perPage}
            page={page}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
            paginationOUIA={`bottom-${paginationOUIA}`}
          />
        </React.Fragment>
      )}
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
  ToolbarButton: PropTypes.elementType,
  actionsConfig: PropTypes.array,
  isRemediationLoading: PropTypes.bool,
  actionsToggle: PropTypes.func,
  hasColumnManagement: PropTypes.bool,
};

export default TableView;

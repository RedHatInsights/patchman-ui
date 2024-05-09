import configureStore from 'redux-mock-store';
import { systemRows } from '../../Utilities/RawDataForTesting.js';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import AdvisorySystems from './AdvisorySystems.js';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { ComponentWithContext } from '../../Utilities/TestingUtilities.js';
import { render, screen, waitFor } from '@testing-library/react';
initMocks();

const mockState = {
    entities: {
        rows: systemRows,
        metadata: {
            limit: 25,
            offset: 0,
            total_items: 10
        },
        expandedRows: {},
        selectedRows: { 'test-system-1': true },
        error: {},
        status: 'resolved',
        total: 101
    },
    AdvisorySystemsStore: {
        queryParams: {}
    }
};

const initStore = (state) => {
    const mockStore = configureStore([]);
    return mockStore(state);
};

const renderComponent = async (mockedStore) => {
    render(<ComponentWithContext renderOptions={{ store: initStore(mockedStore) }}>
        <AdvisorySystems advisoryName={'RHSA-2020:2755'} />
    </ComponentWithContext>);

    await waitFor(() => {
        expect(
            screen.getByTestId('inventory-mock-component')
        ).toBeInTheDocument();
    });
};

describe('AdvisorySystemsTable.js', () => {
    it('Should render inventory table', async () => {
        await renderComponent(mockState);
        expect(screen.getByTestId('inventory-mock-component')).toBeVisible();
    });

    it('Should provide customFilters prop', async () => {
        const filteredState = {
            ...mockState,
            AdvisorySystemsStore: {
                queryParams: {
                    filter: { status: ['Installable'] },
                    search: 'test-search',
                    selectedTags: ['tags=test-tag'],
                    systemProfile: { ansible: { controller_version: 'not_nil' } }
                }
            }
        };

        await renderComponent(filteredState);
        await waitFor(() =>
            expect(InventoryTable).toHaveBeenCalledWith(
                expect.objectContaining({
                    customFilters: {
                        patchParams: {
                            filter: {  status: ['Installable'] },
                            search: 'test-search',
                            selectedTags: ['tags=test-tag'],
                            systemProfile: { ansible: { controller_version: 'not_nil' } }
                        }
                    }
                }),
                {}
            )
        );
    });

    it('should use os and tag filter from Inventory', async () => {
        await renderComponent(mockState);
        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                hideFilters: {
                    all: true,
                    tags: false,
                    operatingSystem: false
                }
            }),
            {}
        );
    });

    it('should disable pagination and export when there are no rows', async () => {
        const emptyStateState = {
            ...mockState,
            entities: {
                ...mockState.entities,
                total: 0
            }
        };

        await renderComponent(emptyStateState);
        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                paginationProps: {
                    isDisabled: true
                }
            }),
            {}
        );

        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                exportConfig: {
                    isDisabled: true,
                    onSelect: expect.any(Function)
                }
            }),
            {}
        );
    });

    it('should provide filterConfig', async () => {
        await renderComponent(mockState);
        await waitFor(() => expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                filterConfig: {
                    items:
                    [
                        {
                            filterValues: {
                                'aria-label': 'search-field',
                                onChange: expect.any(Function),
                                placeholder: 'Filter by name',
                                value: undefined
                            },
                            label: 'System',
                            type: 'text'
                        },
                        {
                            filterValues: {
                                items: [
                                    { label: 'Installable', value: 'Installable' },
                                    { label: 'Applicable', value: 'Applicable' }
                                ],
                                onChange: expect.any(Function),
                                placeholder: 'Filter by status',
                                value: undefined
                            },
                            label: 'Status',
                            type: 'checkbox'
                        }
                    ]
                }
            }),
            {}
        ));
    });

    it('should provide tableProps', async () => {
        await renderComponent(mockState);
        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                tableProps: {
                    actionResolver: expect.any(Function),
                    canSelectAll: false,
                    className: 'patchCompactInventory',
                    isStickyHeader: true,
                    variant: 'compact'
                }
            }),
            {}
        );
    });

    it('should provide activeFilters config', async () => {
        const filteredState = {
            ...mockState,
            AdvisorySystemsStore: {
                queryParams: {
                    filter: { status: ['Installable'] }
                }
            }
        };

        await renderComponent(filteredState);

        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                activeFiltersConfig: {
                    deleteTitle: 'Reset filters',
                    filters: [{
                        category: 'Status',
                        chips: [{
                            id: 'status',
                            name: 'Installable',
                            value: 'Installable'
                        }],
                        id: 'status'
                    }],
                    onDelete: expect.any(Function)
                }
            }),
            {}
        );
    });

    it('should provide bulkSelect config', async () => {
        await renderComponent(mockState);
        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                bulkSelect: {
                    checked: null,
                    isDisabled: false,
                    count: 1,
                    items: [
                        {
                            onClick: expect.any(Function),
                            title: 'Select none (0)'
                        },
                        {
                            onClick: expect.any(Function),
                            title: 'Select page (2)'
                        },
                        {
                            onClick: expect.any(Function),
                            title: 'Select all (101)'
                        }
                    ],
                    onSelect: expect.any(Function),
                    toggleProps: {
                        'aria-label': 'Select',
                        'data-ouia-component-type': 'bulk-select-toggle-button'
                    }
                }
            }),
            {}
        );
    });
});

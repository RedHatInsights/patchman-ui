import configureStore from 'redux-mock-store';
import { systemRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities';
import Systems from './SystemsTable';
import { render, screen, waitFor } from '@testing-library/react';
import { ComponentWithContext } from '../../Utilities/TestingUtilities';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
initMocks();

const mockState = {
    entities: {
        rows: systemRows,
        metadata: {
            limit: 25,
            offset: 0,
            has_systems: true
        },
        selectedRows: { 'test-system-id-1': true },
        total: systemRows.length
    },
    SystemsStore: {
        queryParams: {}
    }
};
const initStore = (state) => {
    const mockStore = configureStore([]);
    return mockStore(state);
};

const renderComponent = async (mockedStore) => {
    render(<ComponentWithContext renderOptions={{ store: initStore(mockedStore) }}>
        <Systems patchSetState={{}}/>
    </ComponentWithContext>);

    await waitFor(() => {
        expect(
            screen.getByTestId('inventory-mock-component')
        ).toBeInTheDocument();
    });
};

describe('SystemsTable', () => {
    it('Should render inventory table', async () => {
        await renderComponent(mockState);
        expect(screen.getByTestId('inventory-mock-component')).toBeVisible();
    });

    it('Should provide customFilters prop', async () => {
        const filteredState = {
            ...mockState,
            SystemsStore: {
                queryParams: {
                    filter: { packages_updatable: 'eq:0' },
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
                            filter: { packages_updatable: 'eq:0' },
                            search: undefined,
                            selectedTags: ['tags=test-tag'],
                            systemProfile: { ansible: { controller_version: 'not_nil' } }
                        }
                    }
                }),
                {}
            )
        );
    });

    it('should use group, os and tag filter from Inventory', async () => {
        await renderComponent(mockState);
        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                hideFilters: {
                    all: true,
                    tags: false,
                    hostGroupFilter: false,
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
                    items: [
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
                                    {
                                        label: 'Stale',
                                        value: 'true'
                                    },
                                    {
                                        label: 'Fresh',
                                        value: 'false'
                                    }
                                ],
                                onChange: expect.any(Function),
                                placeholder: 'Filter by status',
                                value: undefined
                            },
                            label: 'Status',
                            type: 'checkbox'
                        },
                        {
                            filterValues: {
                                items: [
                                    {
                                        label: 'Systems up to date',
                                        value: 'eq:0'
                                    },
                                    {
                                        label: 'Systems with patches available',
                                        value: 'gt:0'
                                    }
                                ],
                                onChange: expect.any(Function),
                                placeholder: 'Filter by patch status',
                                value: undefined
                            },
                            label: 'Patch status',
                            type: 'radio'
                        }
                    ]
                }
            }),
            {}
        ));
    });

    // it('should provide actions config', async () => {
    //     await renderComponent(mockState);
    //     expect(InventoryTable).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             actionsConfig: {
    //                 actions: [
    //                     //Remdiation button
    //                     expect.anything(),
    //                     {
    //                         key: 'assign-multiple-systems',
    //                         label: 'Assign to a template',
    //                         onClick: expect.any(Function),
    //                         props: {
    //                             isDisabled: true
    //                         }
    //                     },
    //                     {
    //                         key: 'remove-multiple-systems',
    //                         label: 'Remove from a template',
    //                         onClick: expect.any(Function),
    //                         props: {
    //                             isDisabled: true
    //                         }
    //                     }
    //                 ]
    //             }
    //         }),
    //         {}
    //     );
    // });

    it('should provide activeFilters config', async () => {
        await renderComponent(mockState);
        expect(InventoryTable).toHaveBeenCalledWith(
            expect.objectContaining({
                activeFiltersConfig: {
                    deleteTitle: 'Reset filters',
                    filters: [
                        {
                            category: 'Patch status',
                            chips: [
                                {
                                    id: 'eq:0',
                                    name: 'Systems up to date',
                                    value: 'eq:0'
                                }
                            ],
                            id: 'packages_updatable'
                        }
                    ],
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
                            title: 'Select all (2)'
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

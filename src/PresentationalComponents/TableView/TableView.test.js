import TableView from './TableView';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { storeListDefaults } from '../../Utilities/constants';
import { systemPackages } from '../../Utilities/RawDataForTesting';
import userEvent from '@testing-library/user-event';

const testObj = {
    columns: [],
    store: {
        rows: [],
        metadata: {},
        status: false,
        queryParams: {}
    },
    onCollapse: jest.fn(),
    onSelect: jest.fn(),
    onSetPage: jest.fn(),
    onPerPageSelect: jest.fn(),
    onSort: jest.fn(),
    onExport: jest.fn(),
    filterConfig: {
        items: [{
            label: 'First filter',
            type: 'text'
        }, {
            label: 'Second filter',
            type: 'checkbox',
            filterValues: {
                items: [{ label: 'Some checkbox' }]
            }
        }]
    },
    sortBy: {},
    remediationProvider: jest.fn(),
    selectedRows: {},
    apply: jest.fn()
};
const mockOnSelect = jest.fn();

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ PackagesListStore: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ PackagesListStore: state });
};

const mockState = {
    ...storeListDefaults,
    rows: systemPackages,
    status: { isLoading: false, code: 200, hasError: false }
};

let store = initStore(mockState);

describe('TableView', () => {
    it('TableView', () => {
        const { asFragment } = render(
            <Provider store={store}>
                <TableView {...testObj} />
            </Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    describe('test table props', () => {

        it('TableView', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <TableView {...testObj}  store = {{
                        rows: [],
                        metadata: { total_items: 10 },
                        status: 'resolved',
                        queryParams: {}
                    }} />
                </Provider>
            );
            expect(asFragment()).toMatchSnapshot();
        });

        it('Should call onSelect', async () => {
            render(
                <Provider store={store}>
                    <TableView {...testObj}
                        onSelect={mockOnSelect}
                        store = {{
                            rows: [],
                            metadata: { total_items: 10 },
                            status: 'resolved',
                            queryParams: {}
                        }} />
                </Provider>
            );
            await userEvent.click(screen.getByRole('checkbox'));
            await waitFor(() =>
                expect(mockOnSelect).toHaveBeenCalled());
        });

    });

    it('TableView', () => {
        const { asFragment } = render(
            <Provider store={store}>
                <TableView {...testObj}  store = {{
                    rows: [],
                    metadata: {},
                    status: 'loading',
                    queryParams: {}
                }} />
            </Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('Should open remediation modal', () => {
        const { asFragment } = render(
            <Provider store={store}>
                <TableView {...testObj} />
            </Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('Should unselect', async () => {
        await render(
            <Provider store={store}>
                <TableView {...testObj}
                    onSelect={mockOnSelect}
                    store = {{
                        rows: [],
                        metadata: { total_items: 10 },
                        status: 'resolved',
                        queryParams: {}
                    }} />
            </Provider>
        );
        await userEvent.click(screen.getByRole('button', {
            name: /select/i
        }));
        await userEvent.click(screen.getByRole('menuitem', { name: /select none \(0\)/i }));
        await waitFor(() =>
            expect(mockOnSelect).toHaveBeenCalledWith('none'));
    });

    it('Should select page', async () => {
        await render(
            <Provider store={store}>
                <TableView {...testObj}
                    onSelect={mockOnSelect}
                    store = {{
                        rows: [],
                        metadata: { total_items: 10 },
                        status: 'resolved',
                        queryParams: {}
                    }} />
            </Provider>
        );
        await userEvent.click(screen.getByRole('button', {
            name: /select/i
        }));
        await userEvent.click(screen.getByRole('menuitem', { name: /select page \(0\)/i }));
        await waitFor(() =>
            expect(mockOnSelect).toHaveBeenCalledWith('page'));
    });

    it('Should select all', async () => {
        await render(
            <Provider store={store}>
                <TableView {...testObj}
                    onSelect={mockOnSelect}
                    store = {{
                        rows: [],
                        metadata: { total_items: 10 },
                        status: 'resolved',
                        queryParams: {}
                    }} />
            </Provider>
        );
        await userEvent.click(screen.getByRole('button', {
            name: /select/i
        }));
        await userEvent.click(screen.getByRole('menuitem', { name: /select all \(10\)/i }));
        await waitFor(() =>
            expect(mockOnSelect).toHaveBeenCalledWith('all', null, null, expect.any(Function)));
    });

    it('Should unselect all ', async () => {
        await render(
            <Provider store={store}>
                <TableView {...testObj}
                    onSelect={mockOnSelect}
                    store = {{
                        rows: [],
                        metadata: { total_items: 10 },
                        status: 'resolved',
                        queryParams: {}
                    }} />
            </Provider>
        );
        await userEvent.click(screen.getByRole('button', {
            name: /select/i
        }));
        await userEvent.click(screen.getByRole('menuitem', { name: /select none \(0\)/i }));
        await waitFor(() =>
            expect(mockOnSelect).toHaveBeenCalledWith('all', null, null, expect.any(Function)));
    });

    it('Should display NoRegisteredSystems when there are no registered systems', async () => {
        await render(
            <Provider store={store}>
                <TableView {...testObj} store={{
                    rows: [],
                    metadata: { total_items: 10, has_systems: false },
                    status: 'resolved',
                    queryParams: {}
                }} />
            </Provider>
        );
        // eslint-disable-next-line max-len
        expect(screen.getByText(/connect your systems to keep your red hat environment running efficiently, with security and compliance with various standards\./i)).toBeTruthy();
        expect(screen.getByRole('link', { name: /learn more about connecting your systems/i })).toBeTruthy();
    });
});

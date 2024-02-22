import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as Actions from '../store/Actions/Actions';

export const ComponentWithContext = ({
    renderOptions = {},
    children
}) => {
    const mockStore = configureStore();

    return (
        <IntlProvider locale="en">
            <Provider store={renderOptions?.store || mockStore()}>
                <MemoryRouter initialEntries={renderOptions?.initialEntries || ['/']}>
                    {
                        renderOptions?.componentPath ? (
                            <Routes>
                                <Route>
                                    {children}
                                </Route>
                            </Routes>
                        ) : children
                    }
                </MemoryRouter>
            </Provider>
        </IntlProvider>
    );
};

ComponentWithContext.propTypes = {
    children: PropTypes.element,
    renderOptions: PropTypes.object
};

export const testExport = (exportCveCallback, exportJsonCallback, exportType) => {
    describe('test exports', () => {
        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));
        it('Should download csv file current', async () => {
            fireEvent.click(screen.getByLabelText('Export'));
            await waitFor(() => {
                expect(screen.getByText('Export to CSV')).toBeVisible();
                screen.debug();
            });

            fireEvent.click(screen.getByText('Export to CSV'));

            await waitFor(() => {
                expect(exportCveCallback).toHaveBeenCalledWith({ page: 1, page_size: 20 }, exportType);
            });
        });

        it('Should download csv file current', async () => {
            fireEvent.click(screen.getByLabelText('Export'));
            await waitFor(() => {
                expect(screen.getByText('Export to CSV')).toBeVisible();
                screen.debug();
            });

            fireEvent.click(screen.getByText('Export to JSON'));

            await waitFor(() => {
                expect(exportJsonCallback).toHaveBeenCalledWith({ page: 1, page_size: 20 }, exportType);
            });
        });
    });
};

export const testBulkSelection = (fetchAllCallback, fetchAllUrl, spyOnAction, selectedItem) => {
    it('should fetch all the data using limit=-1', () => {
        fireEvent.click(screen.getByLabelText('Select'));
        fireEvent.click(screen.getByText('Select all (10)'));

        expect(fetchAllCallback).toHaveBeenCalledWith(
            fetchAllUrl,
            expect.objectContaining({ limit: -1, offset: 0 })
        );
    });

    it('should select rows', async () => {
        const spy = jest.spyOn(Actions, 'selectAdvisoryRow');
        fireEvent.click(screen.getByLabelText('Select'));
        fireEvent.click(screen.getByText('Select page (1)'));

        waitFor(() =>
            expect(spy).toHaveBeenCalledWith(selectedItem)
        );
    });

    it('should unselect rows', async () => {
        const spy = jest.spyOn(Actions, spyOnAction);
        fireEvent.click(screen.getByLabelText('Select'));
        fireEvent.click(screen.getByText('Select none (0)'));

        waitFor(() =>
            expect(spy).toHaveBeenCalledWith([])
        );
    });

};

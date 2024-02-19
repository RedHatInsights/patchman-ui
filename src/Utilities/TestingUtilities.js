import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

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

export const testExport = (exportCveCallback, exportJsonCallback) => {
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
                expect(exportCveCallback).toHaveBeenCalledWith({ page: 1, page_size: 20 }, 'packages');
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
                expect(exportJsonCallback).toHaveBeenCalledWith({ page: 1, page_size: 20 }, 'packages');
            });
        });
    });
};

import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as Actions from '../store/Actions/Actions';

export const ComponentWithContext = ({ renderOptions = {}, children }) => {
  const mockStore = configureStore();

  return (
    <IntlProvider locale='en'>
      <Provider store={renderOptions?.store || mockStore()}>
        <MemoryRouter initialEntries={renderOptions?.initialEntries || ['/']}>
          {renderOptions?.componentPath ? (
            <Routes>
              <Route>{children}</Route>
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );
};

ComponentWithContext.propTypes = {
  children: PropTypes.element,
  renderOptions: PropTypes.object,
};

export const testExport = (exportCveCallback, exportJsonCallback, exportType) => {
  const user = userEvent.setup();
  describe('test exports', () => {
    global.Headers = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({ success: true }).catch((err) => console.log(err)),
    );
    it('Should download csv file current', async () => {
      await user.click(screen.getByLabelText('Export'));
      await waitFor(() => {
        expect(screen.getByText('Export to CSV')).toBeVisible();
      });

      await user.click(screen.getByText('Export to CSV'));

      await waitFor(() => {
        expect(exportCveCallback).toHaveBeenCalledWith({ page: 1, page_size: 20 }, exportType);
      });
    });

    it('Should download csv file current', async () => {
      await user.click(screen.getByLabelText('Export'));
      await waitFor(() => {
        expect(screen.getByText('Export to CSV')).toBeVisible();
      });

      await user.click(screen.getByText('Export to JSON'));

      await waitFor(() => {
        expect(exportJsonCallback).toHaveBeenCalledWith({ page: 1, page_size: 20 }, exportType);
      });
    });
  });
};

export const testBulkSelection = (fetchAllCallback, fetchAllUrl, spyOnAction, selectedItem) => {
  const user = userEvent.setup();
  const spy = jest.spyOn(Actions, spyOnAction);

  it('should fetch all the data using limit=-1', async () => {
    await user.click(screen.getByLabelText('Select'));
    await user.click(screen.getByText('Select all (101)'));
    await waitFor(() => {
      expect(fetchAllCallback).toHaveBeenCalledTimes(2);
      expect(fetchAllCallback).toHaveBeenCalledWith(
        fetchAllUrl,
        expect.objectContaining({ limit: 100, offset: 0 }),
      );
      expect(fetchAllCallback).toHaveBeenCalledWith(
        fetchAllUrl,
        expect.objectContaining({ limit: 100, offset: 100 }),
      );
    });
  });

  it('should unselect rows', async () => {
    await user.click(screen.getByLabelText('Select'));
    await user.click(screen.getByText('Select none (0)'));

    await waitFor(() => expect(spy).toHaveBeenCalledWith([]));
  });

  it('should select rows', async () => {
    await user.click(screen.getByLabelText('Select'));
    await user.click(screen.getByText('Select page (1)'));

    await waitFor(() => expect(spy).toHaveBeenCalledWith(selectedItem));
  });
};

import React from 'react';
import configureStore from 'redux-mock-store';
import { storeListDefaults } from '../../Utilities/constants';
import { cveRows } from '../../Utilities/RawDataForTesting';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import CvesModal from './CvesModal';
import { createCvesRows } from '../../Utilities/DataMappers';
import { render, screen, waitFor } from '@testing-library/react';
import { ComponentWithContext } from '../../Utilities/TestingUtilities.js';
import userEvent from '@testing-library/user-event';

initMocks();

jest.mock('../../Utilities/DataMappers', () => ({
  ...jest.requireActual('../../Utilities/DataMappers'),
  createCvesRows: jest.fn(),
}));

jest.mock('../../Utilities/api/vulnerabilityApi', () => ({
  ...jest.requireActual('../../Utilities/api/vulnerabilityApi'),
  fetchCvesInfo: jest.fn(() => Promise.resolve('success').catch((err) => console.log(err))),
}));

const actualDataMappers = jest.requireActual('../../Utilities/DataMappers');

const mockState = { ...storeListDefaults, rows: cveRows, status: 'fulfilled' };

const initStore = (state) => {
  const mockStore = configureStore([]);
  return mockStore({ CvesListStore: state });
};

let store = initStore(mockState);

let cveIds: Array<string> = [];
cveRows.forEach((cve) => {
  cveIds.push(cve.id);
});

const renderComponent = async () => {
  render(
    <ComponentWithContext renderOptions={{ store: store }}>
      <CvesModal cveIds={cveIds} />
    </ComponentWithContext>,
  );
};

beforeEach(() => {
  (createCvesRows as jest.Mock).mockImplementation(actualDataMappers.createCvesRows);
  renderComponent();
});

describe('CvesModal', () => {
  it('should render the CVEs modal', async () => {
    await waitFor(() => expect(screen.getByText('CVEs')));
    await waitFor(() => expect(screen.findByPlaceholderText('Filter by CVE ID')));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
  });

  it('should close the modal when user clicks close', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('should handle page change', async () => {
    const nextPageButtons = await screen.findAllByRole('button', { name: 'Go to next page' });
    await userEvent.click(nextPageButtons[0]);
    expect(screen.getByText(cveRows[cveRows.length - 1].id)).toBeInTheDocument();
    expect(screen.getByText(cveRows[cveRows.length - 2].id)).toBeInTheDocument();
    expect(screen.queryByText(cveRows[cveRows.length - 3].id)).not.toBeInTheDocument();
  });

  it('should handle per page change', async () => {
    let rows = document.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(10);
    await userEvent.click(document.querySelector('#options-menu-top-toggle') as HTMLElement);
    await userEvent.click(screen.getByRole('menuitem', { name: '20 per page' }));
    rows = document.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(cveRows.length);
  });

  it('should handle sorting', async () => {
    let rows = document.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent(cveRows[0].id);
    await userEvent.click(screen.getByRole('button', { name: 'CVE ID' }));
    rows = document.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveTextContent(cveRows[cveRows.length - 1].id);
  });
});

import configureStore from 'redux-mock-store';
import SelectExistingSets from './SelectExistingSets';
import { initialState } from '../../../store/Reducers/PatchSetsReducer';
import { initMocks } from '../../../Utilities/unitTestingUtilities.js';
import { patchSets } from '../../../Utilities/RawDataForTesting';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComponentWithContext } from '../../../Utilities/TestingUtilities.js';
import userEvent from '@testing-library/user-event';

initMocks();

const mockChage = jest.fn((payload) => payload);

jest.mock('@data-driven-forms/react-form-renderer/use-form-api', () => () => ({
  change: mockChage,
}));

const initStore = (state) => {
  const mockStore = configureStore([]);
  return mockStore({ PatchSetsStore: state });
};

let store = initStore({
  ...initialState,
  rows: patchSets,
  status: { ...initialState, isLoading: false },
});

beforeEach(() => {
  store.clearActions();
  render(
    <ComponentWithContext renderOptions={{ store }}>
      <SelectExistingSets setSelectedPatchSet={jest.fn()} systems={['test-system']} />
    </ComponentWithContext>,
  );
});

describe('SelectExistingSets', () => {
  it('Should render the select existing sets component', () => {
    expect(screen.getByText('Select an existing template')).toBeVisible();
    expect(screen.getByText('Template')).toBeVisible();
  });
  it('Should render the select with options', async () => {
    await userEvent.click(screen.getByRole('button', { name: /filter by template name/i }));
    await waitFor(() => {
      expect(screen.getByText('test-set-1')).toBeInTheDocument();
      expect(screen.getAllByLabelText('patch-set-option')).toHaveLength(patchSets.length);
    });
  });
});

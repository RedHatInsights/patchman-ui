import NameField from './NameField';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { render, screen, waitFor, queryByLabelText } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@data-driven-forms/react-form-renderer/use-form-api', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@data-driven-forms/react-form-renderer/use-field-api', () =>
  jest.fn(() => ({
    input: {
      onChange: jest.fn(),
    },
  })),
);

jest.mock('../../../Utilities/api', () => ({
  ...jest.requireActual('../../../Utilities/api'),
  fetchPatchSets: jest.fn(() =>
    Promise.resolve({ data: [{ attributes: { name: 'taken-template-name' } }] }),
  ),
}));

describe('NameField.js', () => {
  it('Should description field have default value and fire input onChange', () => {
    useFormApi.mockReturnValue({
      getState: () => ({
        values: { name: 'testName' },
      }),
      change: () => {},
    });

    render(<NameField />);
    expect(
      screen.getByRole('textbox', {
        name: /name/i,
      }),
    ).toBeTruthy();
  });

  it('Should display configuration fields', () => {
    useFormApi.mockReturnValue({
      getState: () => ({ values: {} }),
      change: () => {},
    });

    render(<NameField />);
    const input = screen.getByRole('textbox', {
      name: /name/i,
    });
    expect(input.value).toBe('');
  });

  it('Should invalidate taken template names', async () => {
    useFormApi.mockReturnValue({
      getState: () => ({ values: { name: 'taken-template-name' } }),
      change: () => {},
    });

    const { container } = render(<NameField />);

    await waitFor(() => {
      expect(queryByLabelText(container, 'Contents')).not.toBeInTheDocument();
    });
    await waitFor(() =>
      expect(screen.getByText('Template name already exists. Try a different name.')).toBeVisible(),
    );
  });
});

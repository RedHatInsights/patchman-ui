import DescriptionField from './DescriptionField';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { render, screen } from '@testing-library/react';

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

describe('ConfigurationFields.js', () => {
  it('Should description field have default value', () => {
    useFormApi.mockReturnValue({
      getState: () => ({
        values: { description: 'testDescription' },
      }),
    });

    render(<DescriptionField />);
    const input = screen.getByRole('textbox', {
      name: /description/i,
    });
    expect(input.value).toBe('testDescription');
  });

  it('Should display configuration fields', () => {
    useFormApi.mockReturnValue({
      getState: () => ({ values: {} }),
    });

    render(<DescriptionField />);
    const input = screen.getByRole('textbox', {
      name: /description/i,
    });
    expect(input.value).toBe('');
  });
});

import ReviewPatchSet from './ReviewPatchSet';
import { render } from '@testing-library/react';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

jest.mock('@data-driven-forms/react-form-renderer/use-form-api', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ReviewPatchSet.js', () => {
  it('Should display all Patch Template configuration', () => {
    useFormApi.mockReturnValue({
      getState: () => ({
        values: {
          name: 'test-name',
          description: 'test-description',
          toDate: '2022-06-14',
          systems: {
            'test-system-id-1': true,
            'test-system-id-2': true,
          },
        },
      }),
    });
    const { asFragment } = render(<ReviewPatchSet />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should display available configuration fields only', () => {
    useFormApi.mockReturnValue({
      getState: () => ({
        values: {
          name: 'test-name',
          systems: {
            'test-system-id-1': true,
            'test-system-id-2': true,
          },
        },
      }),
    });
    const { asFragment } = render(<ReviewPatchSet />);
    expect(asFragment()).toMatchSnapshot();
  });
});

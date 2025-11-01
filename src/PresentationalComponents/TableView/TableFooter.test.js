import TableFooter from './TableFooter';
import { render } from '@testing-library/react';
const testObj = {
  page: 1,
  perPage: 10,
  onSetPage: jest.fn(),
  totalItems: 10,
  onPerPageSelect: jest.fn(),
};

describe('TableFooter', () => {
  it('Should match the snapshots', () => {
    const { asFragment } = render(<TableFooter {...testObj} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

import { SystemUpToDate } from './SystemUpToDate';
import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

describe('SystemUpToDate', () => {
  it('Should match the snapshot', () => {
    const { asFragment } = render(<SystemUpToDate />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render correct text for the system that is up to date', () => {
    const { container } = render(<SystemUpToDate />);
    expect(queryByText(container, 'No applicable advisories')).not.toBeNull();
    expect(
      queryByText(
        container,
        'This system is up to date, based on package information submitted at the most recent system check-in',
      ),
    ).not.toBeNull();
  });
});

import Error from './Error';
import { render } from '@testing-library/react';

describe('Error.js', () => {
  it('Should match the snapshot', () => {
    const { asFragment } = render(<Error message='testMessage' />);
    expect(asFragment()).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import NoRegisteredSystems from './NoRegisteredSystems';

describe('Not connected component', () => {
  it('should render', () => {
    const { asFragment } = render(<NoRegisteredSystems />);
    expect(asFragment()).toMatchSnapshot();
  });
});

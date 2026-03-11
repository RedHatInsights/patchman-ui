import { render } from '@testing-library/react';
import AdvisorySeverity from './AdvisorySeverity';
import { SEVERITY_MODERATE } from '../../Utilities/constants';

describe('AdvisorySeverity', () => {
  it('Should match the snapshots', () => {
    const { asFragment } = render(<AdvisorySeverity severity={SEVERITY_MODERATE} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

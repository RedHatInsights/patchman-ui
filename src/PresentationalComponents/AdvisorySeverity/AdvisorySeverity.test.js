import { render } from '@testing-library/react';
import AdvisorySeverity from './AdvisorySeverity';

describe('AdvisorySeverity', () => {
  it('Should match the snapshots', () => {
    const { asFragment } = render(
      <AdvisorySeverity
        severity={{
          label: 'Moderate',
          color: 'var(--pf-t--global--icon--color--severity--moderate--default)',
        }}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

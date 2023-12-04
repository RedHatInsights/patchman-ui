import AdvisoryType from './AdvisoryType';
import { render } from '@testing-library/react';

describe('AdvisoryType', () => {
    it('Should match the snapshots', () => {
        const { asFragment } = render(
            <AdvisoryType type = 'security' />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

import AdvisoryHeader from './AdvisoryHeader';
import { advisoryHeader } from '../../Utilities/RawDataForTesting';
import { render } from '@testing-library/react';

describe('AdvisoryHeader', () => {
    it('Should match the snapshots when loading', () => {
        const { asFragment } = render(
            <AdvisoryHeader attributes = {advisoryHeader.attributes} isLoading />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('Should match the snapshots when loaded', () => {
        const { asFragment } = render(
            <AdvisoryHeader attributes = {advisoryHeader.attributes} isLoading = {false} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

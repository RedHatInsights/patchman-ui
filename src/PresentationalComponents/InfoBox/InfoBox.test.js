import InfoBox from './InfoBox';
import { render } from '@testing-library/react';

const props = {
    title: 'testTitle',
    text: 'testText',
    isLoading: false,
    content: 'testContent',
    color: 'testColor'
};

describe('InfoBox', () => {
    it('Should match to snapshots', () => {
        const { asFragment } = render(
            <InfoBox {...props} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

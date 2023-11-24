import Label from './Label';
import { render } from '@testing-library/react';

describe('Label.js', () => {
    it('Should match the snapshot', () => {
        const { asFragment } = render(
            <Label message = {<div></div>} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

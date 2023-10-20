import {
    EmptyAdvisoryList,
    EmptyPackagesList
} from './EmptyStates';
import { render } from '@testing-library/react';

describe('EmptyAdvisoryList', () => {
    it('Should match the snapshot', () => {
        const { asFragment } = render(
            <EmptyAdvisoryList />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('EmptyPackagesList', () => {
    it('Should match the snapshot', () => {
        const { asFragment } = render(
            <EmptyPackagesList />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});

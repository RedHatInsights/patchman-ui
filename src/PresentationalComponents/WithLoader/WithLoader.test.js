import {
    WithLoaderVariants,
    WithLoader
} from './WithLoader';
import { render, screen } from '@testing-library/react';

describe('WithLoader', () => {
    it('Should return child elements if not loading', () => {
        const TestComponent = () => (<div>skeleton</div>);
        render(
            < WithLoader loading = {false} variant={WithLoaderVariants.skeleton} isDark>
                <TestComponent />
            </WithLoader>);
        expect(screen.getByText(/skeleton/i)).toBeTruthy();
        /* expect(wrapper.find('TestComponent')).toBeTruthy(); */
    });

    it('Should display spinner', () => {
        render(< WithLoader loading variant = {WithLoaderVariants.spinner} centered />);
        expect(screen.getByRole('status')).toBeTruthy();
    });
});

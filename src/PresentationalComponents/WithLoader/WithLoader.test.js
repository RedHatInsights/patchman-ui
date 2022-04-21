import {
    WithLoaderVariants,
    WithLoader
} from './WithLoader';

describe('WithLoader', () => {
    it('Should return child elements if not loading', () => {
        const TestComponent = () => (<div></div>);
        const wrapper = shallow(
            < WithLoader loading = {false} variant = {WithLoaderVariants.skeleton} isDark>
                <TestComponent />
            </WithLoader>);
        expect(wrapper.find('TestComponent')).toBeTruthy();

    });

    it('Should display dark skeleton', () => {
        const wrapper = shallow(< WithLoader loading variant = {WithLoaderVariants.skeleton} isDark />);
        const skeleton = wrapper.find('Skeleton');
        expect(skeleton).toBeTruthy();
        expect(wrapper.find('Skeleton').props()).toEqual({
            isDark: true
        });
    });

    it('Should display spinner', () => {
        const wrapper = shallow(< WithLoader loading variant = {WithLoaderVariants.spinner} centered />);
        const skeleton = wrapper.find('Spinner');
        expect(skeleton).toBeTruthy();
        expect(wrapper.find('Spinner').props()).toEqual({
            centered: true
        });
    });
});

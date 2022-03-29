import ConfigurationFields from './ConfigurationFields';

jest.mock('@data-driven-forms/react-form-renderer/use-form-api',
    () => jest.fn(() => ({
        renderForm: () => <div id='test-configuration-fields'> test form</div>
    }))
);

describe('ConfigurationFields.js', () => {
    it('Should display Spinner on patch-set loading', () => {
        const wrapper = mount(<ConfigurationFields isLoading />);
        expect(wrapper.find('Spinner')).toBeTruthy();
    });

    it('Should display configuration fields', () => {
        const wrapper = mount(<ConfigurationFields isLoading={false} />);
        expect(wrapper.find('test-configuration-fields')).toBeTruthy();
    });
});


import ConfigurationFields from './ConfigurationFields';
import { render } from '@testing-library/react';

jest.mock('@data-driven-forms/react-form-renderer/use-form-api',
    () => jest.fn(() => ({
        renderForm: () => <div id='test-configuration-fields'> test form</div>
    }))
);

describe('ConfigurationFields.js', () => {
    it('Should display Spinner on patch-set loading', () => {
        const { container } = render(<ConfigurationFields isLoading />);
        expect(container.querySelector('#test-config-fields-spinner')).toBeTruthy();
    });

    it('Should display configuration fields', () => {
        const { container } = render(<ConfigurationFields isLoading={false} />);
        const text = container.querySelector('#test-configuration-fields');
        expect(text).toBeTruthy();
    });
});


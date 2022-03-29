import DescriptionField from './DescriptionField';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

jest.mock('@data-driven-forms/react-form-renderer/use-form-api',
    () => ({
        __esModule: true,
        default: jest.fn()
    })
);

jest.mock('@data-driven-forms/react-form-renderer/use-field-api',
    () => jest.fn(() =>({
        input: {
            onChange: jest.fn()
        }
    }))
);

describe('ConfigurationFields.js', () => {
    it('Should description field have default value', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({
                values: { description: 'testDescription' }
            })
        })
        );

        const wrapper = mount(<DescriptionField />);
        expect(wrapper.find('input').props().value).toEqual('testDescription');
    });

    it('Should display configuration fields', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({ values: { } })
        })
        );

        const wrapper = mount(<DescriptionField />);
        expect(wrapper.find('input').props().value).toBeFalsy();
    });
});


import NameField from './NameField';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

jest.mock('@data-driven-forms/react-form-renderer/use-form-api',
    () => ({
        __esModule: true,
        default: jest.fn()
    })
);

jest.mock('@data-driven-forms/react-form-renderer/use-field-api',
    () => jest.fn(() => ({
        input: {
            onChange: jest.fn()
        }
    }))
);

describe('ConfigurationFields.js', () => {
    it('Should description field have default value and fire input onChange', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({
                values: { name: 'testName' }
            })
        })
        );

        const wrapper = mount(<NameField/>);
        expect(wrapper.find('input').props().value).toEqual('testName');
    });

    it('Should display configuration fields', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({ values: {} })
        })
        );

        const wrapper = mount(<NameField/>);
        expect(wrapper.find('input').props().value).toBeFalsy();
    });

});


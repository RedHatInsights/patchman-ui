import ToDateField from './ToDateField';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import dateValidator from '../../../Utilities/dateValidator';

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

jest.mock('../../../Utilities/dateValidator',
    () => jest.fn(() => ({}))
);

describe('ConfigurationFields.js', () => {
    it('Should description field have default value', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({
                values: { toDate: 'testToDate' }
            })
        })
        );

        const wrapper = mount(<ToDateField />);
        expect(wrapper.find('input').props().value).toEqual('testToDate');
    });

    it('Should display configuration fields', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({ values: {} })
        })
        );

        const wrapper = mount(<ToDateField />);
        expect(wrapper.find('input').props().value).toBeFalsy();
    });

    it('Should pass dateValidator', () => {
        const wrapper = mount(<ToDateField />);
        const validators = wrapper.find('DatePicker').props().validators;
        expect(validators).toContain(dateValidator);
    });
});


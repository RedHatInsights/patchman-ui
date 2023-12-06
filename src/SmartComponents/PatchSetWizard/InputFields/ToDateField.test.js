import ToDateField from './ToDateField';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { render, screen } from '@testing-library/react';

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
    it('Should description field have default value', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({
                values: { toDate: 'testToDate' }
            })
        })
        );
        render(<ToDateField />);
        expect(screen.getByRole('textbox', {
            name: /todate/i
        }).value).toEqual(
            'testToDate'
        );
    });
});


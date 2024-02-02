import NameField from './NameField';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initialState } from '../../../store/Reducers/SpecificPatchSetReducer';
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

const mockState = initialState;

const initStore = (state) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback({ SpecificPatchSetReducer: state });
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);
    return mockStore({ SpecificPatchSetReducer: state });
};

let store = initStore(mockState);

describe('ConfigurationFields.js', () => {
    it('Should description field have default value and fire input onChange', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({
                values: { name: 'testName' }
            }),
            change: () => { }
        }));

        render(
            <Provider store={store}>
                <NameField />
            </Provider >
        );
        expect(screen.getByRole('textbox', {
            name: /name/i
        })).toBeTruthy();
    });

    it('Should display configuration fields', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({ values: {} }),
            change: () => { }
        }));

        render(
            <Provider store={store}>
                <NameField />
            </Provider >
        );
        const input = screen.getByRole('textbox', {
            name: /name/i
        });
        expect(input.value).toBe('');
    });
});

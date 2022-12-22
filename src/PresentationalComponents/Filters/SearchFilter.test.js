import searchFilter from './SearchFilter';
import { useState, useCallback } from 'react';

const apply = jest.fn();
const mockSetState = jest.fn();
const currentFilter = { search: 'filter' };

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn().mockReturnValueOnce(['testSearch', () => {}]),
    useEffect: jest.fn(),
    useCallback: jest.fn()
}));

describe('SearchFilter', () => {
    it('Should set currentValue to zero and init', () => {
        const response = searchFilter(apply, currentFilter, 'title', 'placeholder');
        expect(response.filterValues.value).toEqual('testSearch');
        expect(response.filterValues.placeholder).toEqual('placeholder');
        expect(response.label).toEqual('title');
        expect(response.type).toEqual('text');
    });

    it('Should call apply with a date', () => {
        useCallback.mockReturnValue(() => apply('testValue'));
        useState.mockClear().mockReturnValue([null, mockSetState]);

        const response = searchFilter(apply, currentFilter, 'title', 'placeholder');
        response.filterValues.onChange('event', 'testValue');
        expect(mockSetState).toHaveBeenCalledWith('testValue');
        expect(apply).toHaveBeenCalledWith('testValue');
    });
});

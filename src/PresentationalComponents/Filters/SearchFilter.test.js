import searchFilter from './SearchFilter';
import { useState } from 'react';

const apply = jest.fn();
const currentFilter = { search: 'filter' };

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn().mockReturnValueOnce(['testSearch', () => {}]).mockReturnValueOnce([() => 'testSearch', () => { }])
    .mockReturnValueOnce(['testSearch', () => { }]).mockReturnValueOnce([() => 'testSearch', () => { }]),
    useEffect: jest.fn()
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
        const response = searchFilter(apply, currentFilter, 'title', 'placeholder');
        response.filterValues.onChange('event', 'testValue');
        expect(useState).toHaveBeenCalledWith(expect.any(Function));
    });
});

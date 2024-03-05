/* eslint-disable */
import { SortByDirection } from '@patternfly/react-table';
import { useEntitlements, useHandleRefresh, usePagePerPage, 
    usePerPageSelect, useRemoveFilter, useSetPage, useSortColumn } from './Hooks';
import { packagesListDefaultFilters } from '../constants';
import { renderHook } from '@testing-library/react';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
    useChrome: jest.fn(() => ({ 
        auth: {
            getUser: () => new Promise(
                (resolve) => resolve({ entitlements: { 'test-entitelement': true } })
            )
        }
    }))
}));


describe('Custom hooks tests', () => {
    it('useSetPage, should return correct offset for pagination', () => {
        let limit = 10;
        let page = 5;
        let finalResult = 40;
        let callback = jest.fn();
        const { result } = renderHook(() => useSetPage(limit, callback));
        result.current({}, page);

        expect(callback).toHaveBeenCalledWith({ offset: finalResult });
    });
    it('usePerPageSelect, should return correct limit and offset', () => {
        let perPage = 15;
        let finalResult = { offset: 0, limit: perPage };
        let callback = jest.fn();
        const { result } = renderHook(() => usePerPageSelect(callback));
        result.current({}, perPage);

        expect(callback).toHaveBeenCalledWith(finalResult);
    });
    it('useSortColumn, should return desc sort with offset ', () => {
        let columns = [
            {
                key: 'a'
            },
            {
                key: 'b'
            },
            {
                key: 'c'
            },
            {
                key: 'd'
            }
        ];
        let offset = 2;
        let index = 2;
        let direction = SortByDirection.desc;
        let finalResult = { sort: '-a' };
        let callback = jest.fn();

        const { result } = renderHook(() => useSortColumn(columns, callback, offset));
        result.current({}, index, direction);

        expect(callback).toHaveBeenCalledWith(finalResult);
    });
    it('useSortColumn, should return asc sort without offset', () => {
        let columns = [
            {
                key: 'a'
            },
            {
                key: 'b'
            },
            {
                key: 'c'
            },
            {
                key: 'd'
            }
        ];
        let index = 0;
        let direction = SortByDirection.asc;
        let finalResult = { sort: 'a' };
        let callback = jest.fn();
        const { result } = renderHook(() => useSortColumn(columns, callback));
        result.current({}, index, direction);

        expect(callback).toHaveBeenCalledWith(finalResult);
    });
    it('usePagePerPage, should return correct page and perPage', () => {
        let limit = 50;
        let offset = 1100;
        let expected = [23, 50];
        const { result } = renderHook(() => usePagePerPage(limit, offset));
        expect(result.current).toEqual(expected);
    });

    it.each`
    filter                    | apply        | selected                                       |finalResult
    ${{ advisory_type: 2 }}     | ${jest.fn()} | ${[{ id: "advisory_type", chips: [{ id: 1 }] }]} | ${{ filter: { advisory_type: undefined }}}
    ${{advisory_type: [2,1]}} | ${jest.fn()} | ${[{ id: "advisory_type", chips: [{id: 1}] }]} | ${{filter: {advisory_type: [2]}}}
    ${{search: "asd"}}        | ${jest.fn()} | ${[{ id: "search"}]}                           | ${{filter: {}, search: ''}}
    `('useRemoveFilter: should return correct filter for $filter',({filter, apply, finalResult, selected}) => {
        const { result } = renderHook(() => useRemoveFilter(filter, apply));
        result.current[0]({}, selected)
        expect(apply).toHaveBeenCalledWith(finalResult);
    });

    it.each`
    filter                    | apply        | selected                                       |finalResult
    ${{ advisory_type: 2 }}     | ${jest.fn()} | ${[{ id: "advisory_type", chips: [{ id: 1 }] }]} | ${{ filter: { advisory_type: undefined, systems_updatable: ["gt:0"] } }}
    ${{ search: "asd" }}        | ${jest.fn()} | ${[{ id: "search" }]}                           | ${{ filter: { systems_updatable: ["gt:0"] }, search: '' }}
    `('useRemoveFilter: should reset to default filters for $filter while ', ({ filter, apply, finalResult, selected }) => {
        const { result } = renderHook(() => useRemoveFilter(filter, apply, packagesListDefaultFilters));
        result.current[0]({}, selected, true)
        expect(apply).toHaveBeenCalledWith(finalResult);
    });

    it.each`
    metadata                    | apply         | input                        | finalResult
    ${{limit: 10, offset: 0}}   | ${jest.fn()}  | ${{page: 2, per_page: 10}}                 | ${{offset:10}}
    ${{limit: 10, offset: 10}}  | ${jest.fn()}  | ${{page: 2, per_page: 20}}                 | ${{offset:20, limit: 20}}
    ${{limit: 10, offset: 10}}  | ${jest.fn()}  | ${{page: 2, per_page: 10}}                 | ${undefined}
    `('useHandleRefresh: should return correct filter',({metadata, apply, finalResult, input}) => {
        const { result } = renderHook(() =>useHandleRefresh(metadata, apply));
        result.current(input)
        if (finalResult) {
            expect(apply).toHaveBeenCalledWith(finalResult);
        }
        else {
            expect(apply).not.toHaveBeenCalled();
        }
    });

    it('useEntitlements, should return correct entitlements', async () => {
        const { result } = renderHook(() => useEntitlements());
        const finalResult = await result.current();
        expect(finalResult).toEqual({ 'test-entitelement': true });
    });
});

/* eslint-disable */
import { SortByDirection } from '@patternfly/react-table/dist/js';
import { useHandleRefresh, usePagePerPage, usePerPageSelect, useRemoveFilter, useSetPage, useSortColumn } from './Hooks';
import { packagesListDefaultFilters } from './constants';
const TestHook = ({ callback }) => {
    callback();
    return null;
};

export const testHook = callback => {
    mount(<TestHook callback={callback} />);
};

describe('Custom hooks tests', () => {
    it('useSetPage, should return correct offset for pagination', () => {
        let limit = 10;
        let page = 5;
        let result = 40;
        let onSetPage;
        let callback = jest.fn();
        testHook(() => {
            onSetPage = useSetPage(limit, callback);
        });
        onSetPage({}, page);

        expect(callback).toHaveBeenCalledWith({ offset: result });
    });
    it('usePerPageSelect, should return correct limit and offset', () => {
        let perPage = 15;
        let result = { offset: 0, limit: perPage };
        let onSetPerPage;
        let callback = jest.fn();
        testHook(() => {
            onSetPerPage = usePerPageSelect(callback);
        });
        onSetPerPage({}, perPage);

        expect(callback).toHaveBeenCalledWith(result);
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
        let result = { sort: '-a' };
        let callback = jest.fn();
        let onSort;
        testHook(() => {
            onSort = useSortColumn(columns, callback, offset);
        });
        onSort({}, index, direction);

        expect(callback).toHaveBeenCalledWith(result);
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
        let result = { sort: 'a' };
        let callback = jest.fn();
        let onSort;
        testHook(() => {
            onSort = useSortColumn(columns, callback);
        });
        onSort({}, index, direction);

        expect(callback).toHaveBeenCalledWith(result);
    });
    it('usePagePerPage, should return correct page and perPage', () => {
        let limit = 50;
        let offset = 1100;
        let expected = [23, 50];
        let res;
        testHook(() => {
            res = usePagePerPage(limit, offset);
        });
        expect(res).toEqual(expected);
    });

    it.each`
    filter                    | apply        | selected                                       |result
    ${{ advisory_type: 2 }}     | ${jest.fn()} | ${[{ id: "advisory_type", chips: [{ id: 1 }] }]} | ${{ filter: { advisory_type: undefined }}}
    ${{advisory_type: [2,1]}} | ${jest.fn()} | ${[{ id: "advisory_type", chips: [{id: 1}] }]} | ${{filter: {advisory_type: [2]}}}
    ${{search: "asd"}}        | ${jest.fn()} | ${[{ id: "search"}]}                           | ${{filter: {}, search: ''}}
    `('useRemoveFilter: should return correct filter for $filter',({filter, apply, result, selected}) => {
        let deleteFilters;
        testHook(() => {
            [deleteFilters] = useRemoveFilter(filter, apply);
        });
        deleteFilters({}, selected)
        expect(apply).toHaveBeenCalledWith(result);
    });

    it.each`
    filter                    | apply        | selected                                       |result
    ${{ advisory_type: 2 }}     | ${jest.fn()} | ${[{ id: "advisory_type", chips: [{ id: 1 }] }]} | ${{ filter: { advisory_type: undefined, systems_updatable: ["gt:0"] } }}
    ${{ search: "asd" }}        | ${jest.fn()} | ${[{ id: "search" }]}                           | ${{ filter: { systems_updatable: ["gt:0"] }, search: '' }}
    `('useRemoveFilter: should reset to default filters for $filter while ', ({ filter, apply, result, selected }) => {
        let deleteFilters;
        testHook(() => {
            [deleteFilters] = useRemoveFilter(filter, apply, packagesListDefaultFilters);
        });
        deleteFilters({}, selected, true)
        expect(apply).toHaveBeenCalledWith(result);
    });

    it.each`
    metadata                    | apply         | input                        | result
    ${{limit: 10, offset: 0}}   | ${jest.fn()}  | ${{page: 2, per_page: 10}}                 | ${{offset:10}}
    ${{limit: 10, offset: 10}}  | ${jest.fn()}  | ${{page: 2, per_page: 20}}                 | ${{offset:20, limit: 20}}
    ${{limit: 10, offset: 10}}  | ${jest.fn()}  | ${{page: 2, per_page: 10}}                 | ${undefined}
    `('useHandleRefresh: should return correct filter',({metadata, apply, result, input}) => {
        let res;
        testHook(() => {
            res = useHandleRefresh(metadata, apply);
        });
        res(input)
        if (result) {
            expect(apply).toHaveBeenCalledWith(result);
        }
        else {
            expect(apply).not.toHaveBeenCalled();
        }
    });
});
/* eslint-enable */

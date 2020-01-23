/* eslint-disable */
import { SortByDirection } from '@patternfly/react-table';
import {
    usePagePerPage,
    usePerPageSelect,
    useSetPage,
    useSortColumn
} from './Hooks';

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
});
/* eslint-enable */

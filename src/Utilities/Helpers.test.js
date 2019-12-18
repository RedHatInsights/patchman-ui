/* eslint-disable */
import { SortByDirection } from '@patternfly/react-table';
import toJson from 'enzyme-to-json';
import {
    addOrRemoveItemFromSet,
    convertLimitOffset,
    createAdvisoriesIcons,
    createSortBy,
    getRowIdByIndexExpandable
} from './Helpers';

const TestHook = ({ callback }) => {
    callback();
    return null;
};

export const testHook = callback => {
    mount(<TestHook callback={callback} />);
};

describe('Helpers tests', () => {
    it('createSortBy, should create correct sortBy  ', () => {
        let header = [
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
        let value = '-a';
        let offset = 0;
        let expected = { index: 0, direction: SortByDirection.desc };
        let ret = createSortBy(header, value, offset);

        expect(ret).toEqual(expected);
    });

    it('createSortBy, should create correct sortBy  ', () => {
        let header = [
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
        let value = 'c';
        let offset = 1;
        let expected = { index: 3, direction: SortByDirection.asc };
        let ret = createSortBy(header, value, offset);

        expect(ret).toEqual(expected);
    });
    it('createSortBy, should create empty object  ', () => {
        let expected = {};
        let ret = createSortBy(undefined, undefined, undefined);

        expect(ret).toEqual(expected);
    });
    it('addOrRemoveItemFromSet, should create correct object  ', () => {
        let inputArr = [
            {
                rowId: 0,
                value: 'a'
            },
            {
                rowId: 1,
                value: 'b'
            },
            {
                rowId: 2,
                value: 'c'
            },
            {
                rowId: 3,
                value: 'd'
            },
            {
                rowId: 5,
                value: undefined
            }
        ];
        let targetObj = { '4': 'e' };
        let expected = { '0': 'a', '1': 'b', '2': 'c', '3': 'd', '4': 'e' };
        let ret = addOrRemoveItemFromSet(targetObj, inputArr);

        expect(ret).toEqual(expected);
    });
    it('convertLimitOffset, should get correct limit and offset', () => {
        let ret = convertLimitOffset(50, 1100);
        let expected = [23, 50];

        expect(ret).toEqual(expected);
    });
    it('getRowIdByIndexExpandable, should return correct id', () => {
        let inputArr = [
            {
                id: 0,
                value: 'a'
            },
            {
                id: 1,
                value: 'b'
            },
            {
                id: 2,
                value: 'c'
            },
            {
                id: 3,
                value: 'd'
            }
        ];
        let ret = getRowIdByIndexExpandable(inputArr, 2);
        let expected = 1;

        expect(ret).toEqual(expected);
    });
    it('create advisory icons snapshot test', () => {
        let wrapper = shallow(createAdvisoriesIcons([1, 2, 3]));
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
/* eslint-enable */

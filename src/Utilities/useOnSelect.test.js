import { act, renderHook } from '@testing-library/react';
import { fetchIDs } from './api';
import { useOnSelect } from './useOnSelect';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => () => {})
}));
jest.mock('./api', () => ({
    ...jest.requireActual('./api'),
    fetchIDs: jest.fn(() => Promise.resolve({
        data: [{ id: 'db-item' }]
    }))
}));

const rows = [
    {
        id: 'row-1',
        selected: true
    },
    {
        id: 'row-2',
        selected: true
    }
];

let selectedRows = {};
let config = {
    endpoint: '/some/api/endpoint',
    queryParams: { search: 'test-search' },
    selectionDispatcher: jest.fn((...args) => args)
};

describe('useOnSelect', () => {
    it('Should select single item', () => {
        const { result } = renderHook(() =>
            useOnSelect(rows, selectedRows, config)
        );

        act(() => {
            result.current('default-single', { 'row-2': true }, 0);
        });

        expect(config.selectionDispatcher).toHaveBeenCalledWith([
            { id: 'row-1', selected: true }
        ]);
    });

    it('Should select single item while constructing new selection name', () => {
        config.constructFilename = jest.fn(() => 'constructed-name');

        const { result } = renderHook(() =>
            useOnSelect(rows, selectedRows, config)
        );

        act(() => {
            result.current('default-single', { 'row-2': true }, 0);
        });

        expect(config.selectionDispatcher).toHaveBeenCalledWith([
            { id: 'row-1', selected: 'constructed-name' }
        ]);
    });

    it('Should select single item while transforming the selection id', () => {
        config.transformKey = jest.fn(() => 'transformed-name');

        const { result } = renderHook(() =>
            useOnSelect(rows, selectedRows, config)
        );

        act(() => {
            result.current('default-single', {}, 0);
        });

        expect(config.selectionDispatcher).toHaveBeenCalledWith([
            { id: 'transformed-name', selected: 'constructed-name' }
        ]);
    });

    it('Should should use custom selector if provided', () => {
        config.customSelector = jest.fn(() => {});

        const { result } = renderHook(() =>
            useOnSelect(rows, selectedRows, config)
        );

        act(() => {
            result.current('default-single', {}, 0);
        });

        expect(config.customSelector).toHaveBeenCalledWith([
            { id: 'transformed-name', selected: 'constructed-name' }
        ]);
    });

    it('Should deselect all', () => {
        const { result } = renderHook(() =>
            useOnSelect(rows, { 'row-1': true, 'row-2': true }, config)
        );

        act(() => {
            result.current('none', {}, 0);
        });

        expect(config.customSelector).toHaveBeenCalledWith([
            { id: 'row-1', selected: false },
            { id: 'row-2', selected: false }
        ]);
    });

    it('Should select page', () => {
        config.transformKey = undefined;
        config.constructFilename = undefined;

        const { result } = renderHook(() =>
            useOnSelect(rows, {}, config)
        );

        act(() => {
            result.current('page', {});
        });

        expect(config.customSelector).toHaveBeenCalledWith([
            { id: 'row-1', selected: 'row-1' },
            { id: 'row-2', selected: 'row-2' }
        ]);
    });

    it('Should select all items from db', () => {
        const { result } = renderHook(() =>
            useOnSelect(rows, {}, config)
        );

        act(() => {
            result.current('all', {});
        });

        expect(fetchIDs).toHaveBeenCalledWith('/some/api/endpoint', { limit: -1, offset: 0, search: 'test-search' });
    });

    it('Should skip invalid rows while selection', () => {
        const rows = [
            {
                id: 'valid-1',
                selected: true
            },
            {
                id: 'is-expanded-row',
                isExpandedRow: true

            },
            {
                id: 'valid-2',
                selected: true
            }
        ];

        const { result } = renderHook(() =>
            useOnSelect(rows, {}, config)
        );

        act(() => {
            result.current('page', {});
        });

        expect(config.customSelector).toHaveBeenCalledWith([
            { id: 'valid-1', selected: 'valid-1' },
            { id: 'valid-2', selected: 'valid-2' }
        ]);
    });
});

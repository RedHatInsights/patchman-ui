import osVersionFilter from './OsVersionFilter';
import { useSelector } from 'react-redux';

const apply = jest.fn();

const mockEntities = {
    operatingSystems: [
        {
            label: 'RHEL 8.7',
            value: '8.7'
        },
        {
            label: 'RHEL 8.8',
            value: '8.8'
        },
        {
            label: 'RHEL 8.9',
            value: '8.9'
        },
        {
            label: 'RHEL 9.0',
            value: '9.0'
        }
    ],
    operatingSystemsLoaded: true
};

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn().mockReturnValue(['', () => {}]),
    useEffect: jest.fn(),
    useCallback: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

jest.mock('@scalprum/react-core', () => ({
    useLoadModule: jest.fn().mockImplementation(() => [
        { toGroupSelectionValue: (val) => val, buildOSFilterConfig: (obj) => obj }
    ])
}));

beforeEach(() => {
    useSelector.mockImplementation(callback => {
        return callback({ entities: mockEntities });
    });
});

describe('OsVersionFilter', () => {
    it('has nothing selected', () => {
        const response = osVersionFilter('', apply);
        console.log('RESPONSE', response);
        expect(response[0].value).toEqual([]);
    });
    it('has one selected as a string', () => {
        const response = osVersionFilter('RHEL 9.0', apply);
        expect(response[0].value).toEqual(['9.0']);
    });
    it('has two selected as a string', () => {
        const response = osVersionFilter('RHEL 8.9, RHEL 9.0', apply);
        expect(response[0].value).toEqual(['8.9', ' 9.0']);
    });
    it('has one selected as an array', () => {
        const response = osVersionFilter(['RHEL 8.7'], apply);
        expect(response[0].value).toEqual(['8.7']);
    });
    it('has one selected as an array', () => {
        const response = osVersionFilter(['RHEL 8.8', 'RHEL 8.9'], apply);
        expect(response[0].value).toEqual(['8.8', '8.9']);
    });
});

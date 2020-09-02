import TableFooter from './TableFooter';
import toJson from 'enzyme-to-json';
/* eslint-disable */
const testObj = { page: 1, perPage: 10, onSetPage: jest.fn(), totalItems: 10, onPerPageSelect: jest.fn() };

describe('TableFooter', () => {
    it('Should match the snapshots', () => {
        const wrapper = mount(<TableFooter { ...testObj} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
/* eslint-enable */

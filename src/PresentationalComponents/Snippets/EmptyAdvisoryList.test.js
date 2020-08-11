import EmptyAdvisoryList from './EmptyAdvisoryList';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

describe('EmptyAdvisoryList', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<EmptyAdvisoryList />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

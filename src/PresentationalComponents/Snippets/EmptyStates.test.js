import { EmptyAdvisoryList, EmptyPackagesList } from './EmptyStates';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

describe('EmptyAdvisoryList', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<EmptyAdvisoryList />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('EmptyPackagesList', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<EmptyPackagesList />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

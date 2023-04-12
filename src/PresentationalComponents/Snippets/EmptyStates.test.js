import {
    EmptyAdvisoryList,
    EmptyPackagesList,
    NoSatellite
} from './EmptyStates';
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

describe('NoSatellite', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<NoSatellite />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

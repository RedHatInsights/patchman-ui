import PortalAdvisoryLink from './PortalAdvisoryLink';
import toJson from 'enzyme-to-json';

const wrapper = shallow(<PortalAdvisoryLink advisory = {'testAdvisory'} />);

describe('PortalAdvisoryLink', () => {
    it('Should match the snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

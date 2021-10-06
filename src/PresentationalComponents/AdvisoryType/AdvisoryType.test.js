import AdvisoryType from './AdvisoryType';
import toJson from 'enzyme-to-json';

describe('AdvisoryType', () => {
    it('Should match the snapshots', () => {
        const wrapper = mount(<AdvisoryType type = 'security' />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

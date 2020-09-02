import AdvisoryType from './AdvisoryType';
import toJson from 'enzyme-to-json';

describe('AdvisoryType', () => {
    it('Should match the snapshots', () => {
        const wrapper = mount(<AdvisoryType type = {3} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should match the snapshots', () => {
        const wrapper = mount(<AdvisoryType type = {undefined} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

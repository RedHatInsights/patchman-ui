import NoAccess from './NoAccess';
import toJson from 'enzyme-to-json';

describe('RegisterPage', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<NoAccess />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

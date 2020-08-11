import RegisterPage from './RegisterPage';
import toJson from 'enzyme-to-json';

describe('RegisterPage', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<RegisterPage />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

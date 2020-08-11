import Label from './Label';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

describe('Label.js', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<Label message = {<div></div>} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

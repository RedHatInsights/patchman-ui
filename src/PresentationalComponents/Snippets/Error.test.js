import Error from './Error';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

describe('Error.js', () => {
    it('Should match the snapshot', () => {
        const wrapper = shallow(<Error message = {'testMessage'} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});


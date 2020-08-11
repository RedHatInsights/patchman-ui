import { NoSystemData } from './NoSystemData';
import toJson from 'enzyme-to-json';

const wrapper = shallow(<NoSystemData />);

describe('NoSystemData', () => {
    it('Should match the snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

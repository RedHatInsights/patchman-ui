import InfoBox from './InfoBox';
import toJson from 'enzyme-to-json';

const props = {
    title: 'testTitle',
    text: 'testText',
    isLoading: false,
    content: 'testContent',
    color: 'testColor'
};

describe('InfoBox', () => {
    it('Should match to snapshots', () => {
        const wrapper = shallow(<InfoBox {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

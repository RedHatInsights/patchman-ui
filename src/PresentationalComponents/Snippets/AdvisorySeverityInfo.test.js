import AdvisorySeverityInfo from './AdvisorySeverityInfo';
import toJson from 'enzyme-to-json';

const severity = { label: 'testLabel', text: 'testText' };
const wrapper = shallow(<AdvisorySeverityInfo severity = {severity} />);

describe('AdvisorySeverityInfo', () => {
    it('Should match the snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should redirect to securities app', () => {
        const hrefTag = wrapper.find('Popover').props().footerContent;
        const hrefProp = hrefTag.props.href;
        expect(hrefProp).toEqual('https://access.redhat.com/security/updates/classification/');
    });
});

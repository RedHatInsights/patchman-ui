import { SystemUpToDate } from './SystemUpToDate';
import toJson from 'enzyme-to-json';

const wrapper = shallow(<SystemUpToDate />);

describe('SystemUpToDate', () => {
    it('Should match the snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should render CheckCircleIcon', () => {
        const iconRender = wrapper.find('EmptyStateIcon').props().icon;
        const component = iconRender();
        expect(component.type.displayName).toEqual('CheckCircleIcon');
    });
});

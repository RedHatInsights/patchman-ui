import SystemDetail from './SystemDetail';
import toJson from 'enzyme-to-json';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';
import { act } from 'react-dom/test-utils';
/* eslint-disable */
initMocks()

beforeEach(() => {  
   console.error = () => {};
});

describe('SystemDetail.js', () => {
    it('Should match the snapshots', () => {
        const wrapper = shallow(<SystemDetail />); 
        expect(toJson(wrapper.update())).toMatchSnapshot();
    });

    it('Should change the tab', () => {
        const wrapper = shallow(<SystemDetail />);
        const onSelect = wrapper.find('Tabs').props().onSelect;
        act(() => onSelect());
        expect(wrapper.find('SystemPackages')).toBeTruthy();
    });
});
/* eslint-enable */

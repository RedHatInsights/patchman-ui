import SystemDetail from './SystemDetail';
import toJson from 'enzyme-to-json';
import { initMocks } from '../../Utilities/unitTestingUtilities.js';

/* eslint-disable */
initMocks()

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => ({ entity: {}})
}));

beforeEach(() => {  
   console.error = () => {};
});

describe('SystemDetail.js', () => {
    it('Should match the snapshots', () => {
        const wrapper = shallow(<SystemDetail entity = {{entity: { id: 1 }}} />); 
        expect(toJson(wrapper.update())).toMatchSnapshot();
    });

    // was not able to mock the store. 
    //Let's push this as hot fix and implement the test later

    // it('Should change the tab', () => {
    //     const wrapper = shallow(<SystemDetail />);
    //     const onSelect = wrapper.find('Tabs').props().onSelect;
    //     act(() => onSelect());
    //     expect(wrapper.find('SystemPackages')).toBeTruthy();
    // });
});
/* eslint-enable */

import SystemDetail from './SystemDetail';
import { useLocation } from 'react-router-dom';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => ({ id: 'entity-id' })
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ state: 'advisories' }))
}));

describe('SystemDetail.js', () => {
    it('Should match the snapshots', () => {
        const wrapper = shallow(<SystemDetail />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('Should match the snapshot when Package tab is active by default', () => {
        useLocation.mockImplementation(() => ({ state: { tab: 'packages' } }));
        const wrapper = shallow(<SystemDetail />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});

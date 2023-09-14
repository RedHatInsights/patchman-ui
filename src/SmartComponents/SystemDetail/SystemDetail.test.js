import SystemDetail from './SystemDetail';
import { useLocation } from 'react-router-dom';
import ShallowRenderer from 'react-test-renderer/shallow';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: () => ({ id: 'entity-id' })
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ state: 'advisories' }))
}));
const renderer = new ShallowRenderer();

describe('SystemDetail.js', () => {
    it('Should match the snapshots', () => {
        renderer.render(
            <SystemDetail />
        );
        const result = renderer.getRenderOutput();
        expect(result).toMatchSnapshot();
    });

    it('Should match the snapshot when Package tab is active by default', () => {
        useLocation.mockImplementation(() => ({ state: { tab: 'packages' } }));
        renderer.render(
            <SystemDetail />
        );
        const result = renderer.getRenderOutput();
        expect(result).toMatchSnapshot();
    });
});


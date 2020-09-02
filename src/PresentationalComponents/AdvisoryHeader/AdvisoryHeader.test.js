import AdvisoryHeader from './AdvisoryHeader';
import { advisoryHeader } from '../../Utilities/RawDataForTesting';
import toJson from 'enzyme-to-json';

describe('AdvisoryHeader', () => {
    it('Should match the snapshots when loading', () => {
        const wrapper = shallow(<AdvisoryHeader attributes = {advisoryHeader.attributes} isLoading />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should match the snapshots when loaded', () => {
        const wrapper = shallow(<AdvisoryHeader attributes = {advisoryHeader.attributes} isLoading = {false} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

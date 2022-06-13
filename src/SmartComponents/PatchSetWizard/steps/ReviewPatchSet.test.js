import ReviewPatchSet from './ReviewPatchSet';
import toJson from 'enzyme-to-json';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

jest.mock('@data-driven-forms/react-form-renderer/use-form-api',
    () => ({
        __esModule: true,
        default: jest.fn()
    })
);

describe('ReviewPatchSet.js', () => {
    it('Should display all Patch set configuration', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({
                values: {
                    name: 'test-name',
                    description: 'test-description',
                    toDate: '2022-06-14',
                    systems: {
                        'test-system-id-1': true,
                        'test-system-id-2': true
                    }
                }
            })
        }));
        const wrapper = mount(<ReviewPatchSet />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should display available configuration fields only', () => {
        useFormApi.mockReturnValue(({
            getState: () => ({
                values: {
                    name: 'test-name',
                    systems: {
                        'test-system-id-1': true,
                        'test-system-id-2': true
                    }
                }
            })
        }));
        const wrapper = mount(<ReviewPatchSet/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});


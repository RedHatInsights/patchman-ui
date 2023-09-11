import { SystemUpToDate } from './SystemUpToDate';
import { render } from '@testing-library/react';

const { asFragment } = render(<SystemUpToDate />);

describe('SystemUpToDate', () => {
    it('Should match the snapshot', () => {
        expect(asFragment()).toMatchSnapshot();
    });

    /* it('Should render CheckCircleIcon', () => {
        const iconRender = wrapper.find('EmptyStateIcon').props().icon;
        const component = iconRender();
        expect(component.type.displayName).toEqual('CheckCircleIcon');
    }); */
});

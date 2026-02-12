import PatchSetWrapper from './PatchSetWrapper';
import { useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mountWithRouterAndProviderAndIntl } from '../../../config/rtlwrapper';

jest.mock('../../SmartComponents/PatchSetWizard/PatchSetWizard', () => () => (
  <div id='test-patch-set-wizard'></div>
));
jest.mock('../../SmartComponents/Modals/UnassignSystemsModal', () => () => (
  <div id='test-unassign-systems-modal'></div>
));

const mockState = {};

const initStore = (state) => {
  const customMiddleWare = () => (next) => (action) => {
    useSelector.mockImplementation((callback) => callback({ SpecificPatchSetReducer: state }));
    next(action);
  };

  const mockStore = configureStore([customMiddleWare]);
  return mockStore({});
};

let store = initStore(mockState);

const testProps = {
  patchSetState: {
    isUnassignSystemsModalOpen: true,
    isPatchSetWizardOpen: true,
    systemsIDs: ['system-1', 'system-2'],
  },
  setPatchSetState: jest.fn(),
  totalItems: 101,
};
describe('PatchSetWrapper', () => {
  it('should display PatchSetWizard when isPatchSetWizardOpen prop is true', () => {
    const { container } = mountWithRouterAndProviderAndIntl(
      <PatchSetWrapper {...testProps} />,
      store,
    );
    expect(container.querySelector('#test-patch-set-wizard')).toBeTruthy();
  });

  it('should hide PatchSetWizard when isPatchSetWizardOpen prop is false', () => {
    const testHiddenState = {
      patchSetState: { ...testProps.patchSetState, isPatchSetWizardOpen: false },
      ...testProps.setPatchSetState,
    };
    const { container } = mountWithRouterAndProviderAndIntl(
      <PatchSetWrapper {...testHiddenState} />,
      store,
    );
    expect(container.querySelector('#test-patch-set-wizard')).toBeFalsy();
  });

  it('should display UnassignSystemsModal when isUnassignSystemsModalOpen prop is true', () => {
    const { container } = mountWithRouterAndProviderAndIntl(
      <PatchSetWrapper {...testProps} />,
      store,
    );
    expect(container.querySelector('#test-unassign-systems-modal')).toBeTruthy();
  });

  it('should hide UnassignSystemsModal when isUnassignSystemsModalOpen prop is false', () => {
    const testHiddenState = {
      patchSetState: { ...testProps.patchSetState, isUnassignSystemsModalOpen: false },
      ...testProps.setPatchSetState,
    };
    const { container } = mountWithRouterAndProviderAndIntl(
      <PatchSetWrapper {...testHiddenState} />,
      store,
    );
    expect(container.querySelector('#test-unassign-systems-modal')).toBeFalsy();
  });
});

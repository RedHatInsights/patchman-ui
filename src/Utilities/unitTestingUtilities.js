/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
export const initMocks = () => {
    window.insights = {
        chrome: {
            appNavClick: () => {},
            init: jest.fn(),
            identifyApp: () => {},
            navigation: () => {},
            on: () => {
                return () => {};
            },
            isBeta: () => true,
            auth: {
                getUser: () =>
                    new Promise((resolve) =>
                        resolve({
                            identity: {
                                user: {}
                            }
                        })
                    )
            },
            getUserPermissions: () => Promise.resolve([])
        },
        loadInventory: () => new Promise((resolve) =>  {
            resolve(({
                inventoryConnector: () => {
                    const InventoryTable = ({ children }) => <div>A mock passed! {children} </div>;
                    const InventoryDetailHead = ({ children }) => <div>A mock passed! {children} </div>;
                    const AppInfo = ({ children }) => <div>A mock passed! {children} </div>;
                    const DetailWrapper = ({ children }) => <div>A mock passed! {children} </div>;

                    return ({ InventoryTable, InventoryDetailHead, AppInfo, DetailWrapper });
                },
                mergeWithEntities: () => {},
                mergeWithDetail: () => {}
            }));
        }),
        loadRemediations: () => new Promise((resolve) =>  {
            resolve({
                openWizard: () => new Promise((resolve) =>  {
                    resolve(true);
                })
            });
        })
    };

};

export const mockStore = (initialState, mutatedState) => {
    const customMiddleWare = () => next => action => {
        useSelector.mockImplementation(callback => {
            return callback(mutatedState);
        });
        next(action);
    };

    // eslint-disable-next-line no-undef
    const configuredMockStore = configureStore([customMiddleWare]);

    return configuredMockStore(initialState);
};

export const mountWithIntl = (Component) => {
    const wrapper = mount(Component, {
        wrappingComponent: IntlProvider
    });
    const provider = wrapper.getWrappingComponent();
    provider.setProps({ locale: 'en' });

    return wrapper;
};

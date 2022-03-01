/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
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
                    new Promise((resolve, reject) =>{
                        resolve({
                            identity: {
                                user: {}
                            }
                        });
                        reject('error');
                    })
            },
            getUserPermissions: () => Promise.resolve([]).catch(err => {
                console.log('this is user permissions error:', err);
            })
        },
        loadInventory: () => new Promise((resolve, reject) =>  {
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
            reject('error');
        }).catch(err => {
            console.log('this is user permissions error:', err);
        }),
        loadRemediations: () => new Promise((resolve, reject) =>  {
            resolve({
                openWizard: () => new Promise((resolve) =>  {
                    resolve(true);
                }).catch(err => {
                    console.log('this is openWizard error:', err);
                })
            });
            reject('error');
        }).catch(err => {
            console.log('this is user permissions error:', err);
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

import { useSelector } from 'react-redux';

/* eslint-disable */
export const initMocks = () => {

    window.insights = {
        loadInventory: (args) => new Promise((resolve, reject) =>  {
            resolve(({
                inventoryConnector: (args) => {
                            const InventoryTable = ({ children }) => <div >A mock passed! {children} </div>;
                            return ({ InventoryTable });
                        },
                        mergeWithEntities: () => {}
            }));
        }),
        loadRemediations: () => new Promise((resolve, reject) =>  {
            resolve({ 
                openWizard: () => new Promise((resolve, reject) =>  { 
                    resolve(true)
                })
            });
        })
    };

};

export const mockStore = (initialState, mutatedState) => {
    const customMiddleWare = store => next => action => {
        useSelector.mockImplementation(callback => {
            return callback(mutatedState);
        });
        next(action);
    };

    const mockStore = configureStore([customMiddleWare]);

    return mockStore(initialState);
}
/* eslint-enable */

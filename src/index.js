import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SystemDetail from './SmartComponents/SystemDetail/SystemDetail';
const WrappedSystemDetail = (props) => {
    return <Router>
        <SystemDetail {...props} isInventoryApp/>
    </Router>;
};

export { SystemAdvisoryListStore } from './store/Reducers/SystemAdvisoryListStore';
export { SystemPackageListStore } from './store/Reducers/SystemPackageListStore';

export default WrappedSystemDetail;

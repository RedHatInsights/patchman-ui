import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SystemAdvisories from './SmartComponents/SystemAdvisories/SystemAdvisories';
const WrappedSystemAdvisories = (props) => {
    return <Router>
        <SystemAdvisories {...props} />
    </Router>;
};

export { SystemAdvisoryListStore } from './store/Reducers/SystemAdvisoryListStore';
export default WrappedSystemAdvisories;

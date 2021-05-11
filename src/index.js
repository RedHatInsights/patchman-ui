import React, { useEffect, useState, Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SystemDetail from './SmartComponents/SystemDetail/SystemDetail';
import { SystemAdvisoryListStore } from './store/Reducers/SystemAdvisoryListStore';
import { SystemPackageListStore } from './store/Reducers/SystemPackageListStore';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

const WrappedSystemDetail = ({ getRegistry, ...props }) => {
    const [Wrapper, setWrapper] = useState();
    useEffect(() => {
        if (getRegistry) {
            getRegistry()?.register?.({ SystemAdvisoryListStore, SystemPackageListStore });
        }

        setWrapper(() => getRegistry ? Provider : Fragment);
    }, []);
    return <Router>
        {
            Wrapper ? <Wrapper {...getRegistry && { store: getRegistry()?.getStore() }}>
                <SystemDetail {...props} isInventoryApp />
            </Wrapper> : <Bullseye>
                <Spinner size="xl" />
            </Bullseye>
        }
    </Router>;
};

WrappedSystemDetail.propTypes = {
    getRegistry: PropTypes.func
};

export { SystemPackageListStore, SystemAdvisoryListStore };

export default WrappedSystemDetail;

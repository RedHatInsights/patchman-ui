import React, { useEffect } from 'react';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
import { DEFAULT_PATCH_TITLE } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import SystemsMainContent from './SystemsMainContent';

const SystemsPage = () => {
    const chrome = useChrome();
    useEffect(()=>{
        chrome.updateDocumentTitle(`${intl.formatMessage(messages.titlesSystems)}${DEFAULT_PATCH_TITLE}`);
    }, [chrome, intl]);

    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.titlesPatchSystems)} headerOUIA={'systems'} />
            <SystemsMainContent />
        </React.Fragment>
    );
};

export default SystemsPage;

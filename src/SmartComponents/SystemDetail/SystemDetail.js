import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import React from 'react';
import SystemAdvisories from '../SystemAdvisories/SystemAdvisories';
import { useSelector } from 'react-redux';
import SystemPackages from '../SystemPackages/SystemPackages';
import './SystemDetail.scss';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { NoSystemData } from '../../PresentationalComponents/Snippets/NoSystemData';
import propTypes from 'prop-types';

const SystemDetail = ({ isInventoryApp }) => {
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const [areTabsHidden, setTabsHidden] = React.useState(false);

    const entity = useSelector(({ entityDetails }) => entityDetails.entity || {});
    const onTabSelect = (event, id) => {
        setActiveTabKey(id);
    };

    const handleNoSystemData = () => {
        isInventoryApp && setTabsHidden(prevTabsHidden => !prevTabsHidden);
        return isInventoryApp && null || NoSystemData;
    };

    return !entity.id ? null : (!areTabsHidden && (
        <Tabs activeKey={activeTabKey} onSelect={onTabSelect} className={'patchTabSelect'} isHidden>
            <Tab eventKey={0} title={<TabTitleText>{intl.formatMessage(messages.titlesAdvisories)}</TabTitleText>}
                data-ouia-component-type={`system-advisories-tab`}
                data-ouia-component-id={`system-advisories-tab`}
            >
                <SystemAdvisories handleNoSystemData={handleNoSystemData}/>
            </Tab>
            <Tab
                eventKey={1}
                title={<TabTitleText>{intl.formatMessage(messages.titlesPackages)}</TabTitleText>}
                data-ouia-component-type={`system-packages-tab`}
                data-ouia-component-id={`system-packages-tab`}
            >
                <SystemPackages handleNoSystemData={handleNoSystemData}/>
            </Tab>
        </Tabs>
    )  || <NoSystemData/>);
};

SystemDetail.propTypes = {
    isInventoryApp: propTypes.bool
};
export default SystemDetail;

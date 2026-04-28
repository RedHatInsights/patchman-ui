import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import SystemAdvisories from '../SystemAdvisories/SystemAdvisories';
import SystemPackages from '../SystemPackages/SystemPackages';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import propTypes from 'prop-types';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';

const SystemDetail = ({ isInventoryApp, inventoryId, shouldRefresh }) => {
  const { state } = useLocation();

  const [activeTabKey, setActiveTabKey] = useState(state?.tab === 'packages' ? 1 : 0);
  const [areTabsHidden, setTabsHidden] = useState(false);

  const onTabSelect = (event, id) => {
    setActiveTabKey(id);
  };

  const handleNoSystemData = () => {
    isInventoryApp && setTabsHidden((prevTabsHidden) => !prevTabsHidden);
    return isInventoryApp ? null : <NotConnected />;
  };

  return (
    (!areTabsHidden && (
      <Tabs activeKey={activeTabKey} onSelect={onTabSelect} isHidden isSubtab={isInventoryApp}>
        <Tab
          eventKey={0}
          title={<TabTitleText>{intl.formatMessage(messages.titlesAdvisories)}</TabTitleText>}
          data-ouia-component-type='system-advisories-tab'
          data-ouia-component-id='system-advisories-tab'
          id='system-advisories-tab'
        >
          <div className={spacing.mtMd}>
            <SystemAdvisories
              handleNoSystemData={handleNoSystemData}
              inventoryId={inventoryId}
              shouldRefresh={shouldRefresh}
            />
          </div>
        </Tab>
        <Tab
          eventKey={1}
          title={<TabTitleText>{intl.formatMessage(messages.titlesPackages)}</TabTitleText>}
          data-ouia-component-type='system-packages-tab'
          data-ouia-component-id='system-packages-tab'
          id='system-packages-tab'
        >
          <div className={spacing.mtMd}>
            <SystemPackages
              handleNoSystemData={handleNoSystemData}
              inventoryId={inventoryId}
              shouldRefresh={shouldRefresh}
            />
          </div>
        </Tab>
      </Tabs>
    )) || <NotConnected />
  );
};

SystemDetail.propTypes = {
  isInventoryApp: propTypes.bool,
  inventoryId: propTypes.string.isRequired,
  shouldRefresh: propTypes.bool,
};
export default SystemDetail;

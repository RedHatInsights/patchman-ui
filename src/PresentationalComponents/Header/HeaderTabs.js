import { Tab, Tabs } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import './Header.scss';
import { useLocation, useNavigate } from 'react-router-dom';

const HeaderTabs = ({ headerOUIA }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleRedirect = (event, tabString) => {
    navigate(tabString);
  };

  return (
    <Tabs onSelect={handleRedirect} activeKey={location.pathname} className={'patchman-tabs'}>
      <Tab
        eventKey={'advisories'}
        title={'Applicable advisories'}
        data-ouia-component-type={`${headerOUIA}-tab`}
        data-ouia-component-id={`${headerOUIA}-tab-Applicable advisories'`}
      />
      <Tab
        eventKey={'systems'}
        title={'Systems'}
        data-ouia-component-type={`${headerOUIA}-tab`}
        data-ouia-component-id={`${headerOUIA}-tab-Systems`}
      />
    </Tabs>
  );
};

HeaderTabs.propTypes = {
  headerOUIA: propTypes.string,
};

export default HeaderTabs;

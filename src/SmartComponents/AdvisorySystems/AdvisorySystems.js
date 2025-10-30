import propTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import {
  changeAffectedSystemsParams,
  clearAdvisorySystemsReducer,
  clearInventoryReducer,
} from '../../store/Actions/Actions';
import { decodeQueryparams } from '../../Utilities/Helpers';
import { osParamParser } from '../../Utilities/SystemsHelpers';
import RemediationWizard from '../Remediation/RemediationWizard';
import { useSearchParams } from 'react-router-dom';
import { useActivateRemediationModal } from '../Systems/SystemsListAssets';
import AdvisorySystemsTable from './AdvisorySystemsTable';

const AdvisorySystems = ({ advisoryName }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isRemediationOpen, setRemediationOpen] = useState(false);
  const [remediationIssues, setRemediationIssues] = useState([]);

  const decodedParams = decodeQueryparams('?' + searchParams.toString(), { os: osParamParser });
  const status = useSelector(({ entities }) => entities?.status || {});
  const metadata = useSelector(({ AdvisorySystemsStore }) => AdvisorySystemsStore?.metadata || {});

  useEffect(() => {
    apply(decodedParams);
    return () => {
      dispatch(clearInventoryReducer());
      dispatch(clearAdvisorySystemsReducer());
    };
  }, []);

  function apply(params) {
    dispatch(changeAffectedSystemsParams(params));
  }

  const activateRemediationModal = useActivateRemediationModal(
    setRemediationIssues,
    setRemediationOpen,
  );

  if (status.hasError || metadata?.has_systems === false) {
    return <ErrorHandler code={status.code} metadata={metadata} />;
  }

  return (
    <React.Fragment>
      {(isRemediationOpen && (
        <RemediationWizard
          data={remediationIssues}
          isRemediationOpen
          setRemediationOpen={setRemediationOpen}
        />
      )) ||
        null}
      <AdvisorySystemsTable
        setSearchParams={setSearchParams}
        activateRemediationModal={activateRemediationModal}
        advisoryName={advisoryName}
        decodedParams={decodedParams}
        apply={apply}
      />
    </React.Fragment>
  );
};

AdvisorySystems.propTypes = {
  advisoryName: propTypes.string,
};

export default AdvisorySystems;

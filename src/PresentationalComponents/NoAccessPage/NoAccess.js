import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React from 'react';
import Header from '../Header/Header';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import ErrorHandler from '../Snippets/ErrorHandler';
import propTypes from 'prop-types';

const NoAccess = ({ code }) => (
    <React.Fragment>
        <Header title={intl.formatMessage(messages.generalAppName)}/>
        <Main>
            <ErrorHandler code={code}  />
        </Main>
    </React.Fragment>
);

NoAccess.propTypes = {
    code: propTypes.number
};

export default NoAccess;

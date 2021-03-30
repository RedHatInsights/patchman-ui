import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React from 'react';
import Header from '../Header/Header';
import { NoSystemData } from '../Snippets/NoSystemData';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const RegisterPage = () => {
    return (
        <React.Fragment>
            <Header title={intl.formatMessage(messages.generalAppName)}/>
            <Main>
                <div>
                    <NoSystemData/>
                </div>
            </Main>
        </React.Fragment>
    );
};

export default RegisterPage;

import { Main } from '@redhat-cloud-services/frontend-components';
import React from 'react';
import Header from '../Header/Header';
import { NoSystemData } from '../Snippets/NoSystemData';

const RegisterPage = () => {
    return (
        <React.Fragment>
            <Header title={'Patch'}/>
            <Main>
                <div>
                    <NoSystemData/>
                </div>
            </Main>
        </React.Fragment>
    );
};

export default RegisterPage;

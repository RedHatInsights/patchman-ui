import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem, Spinner } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { nameComponent, descriptionComponent } from '../WizardAssets';

const ConfigurationFields = ({ isLoading }) =>{
    const { renderForm } = useFormApi();

    return isLoading ? <Spinner size='md' /> : (
        <Grid hasGutter>
            <GridItem lg={12} md={12}>
                {renderForm(nameComponent)}
            </GridItem>
            <GridItem lg={12} md={12}>
                {renderForm(descriptionComponent)}
            </GridItem>
        </Grid>
    );
};

ConfigurationFields.propTypes = {
    isLoading: propTypes.bool
};
export default ConfigurationFields;

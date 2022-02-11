import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { nameComponent, descriptionComponent, toDateComponent } from '../WizardAssets';
const  ConfigurationFields = () =>{
    const { renderForm } = useFormApi();

    return (
        <Grid hasGutter>
            <GridItem lg={12} md={12}>
                {renderForm(nameComponent)}
            </GridItem>
            <GridItem lg={12} md={12}>
                {renderForm(descriptionComponent)}
            </GridItem>
            <GridItem lg={6} md={6}>
                {renderForm(toDateComponent)}
            </GridItem>
        </Grid>
    );
};

export default ConfigurationFields;

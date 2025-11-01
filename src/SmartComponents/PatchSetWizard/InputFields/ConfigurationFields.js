import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem, Spinner } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { nameComponent, descriptionComponent } from '../WizardAssets';

const ConfigurationFields = ({ isLoading }) => {
  const { renderForm } = useFormApi();

  return (
    <Fragment>
      {/* The form element always need to be rendered in order to correctly disable "Next" button,
                that's why these are hidden using "display: none" instead of not rendering */}
      <Spinner
        size='xl'
        style={{ display: isLoading ? 'block' : 'none' }}
        id='test-config-fields-spinner'
      />
      <Grid hasGutter style={{ display: isLoading ? 'none' : 'grid' }}>
        <GridItem lg={12} md={12}>
          {renderForm(nameComponent)}
        </GridItem>
        <GridItem lg={12} md={12}>
          {renderForm(descriptionComponent)}
        </GridItem>
      </Grid>
    </Fragment>
  );
};

ConfigurationFields.propTypes = {
  isLoading: propTypes.bool,
};
export default ConfigurationFields;

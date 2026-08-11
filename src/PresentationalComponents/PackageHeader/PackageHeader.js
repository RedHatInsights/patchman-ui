import React, { useState } from 'react';
import { Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import { truncateDescription } from '../../Utilities/Helpers';
import WithLoader, { WithLoaderVariants } from '../WithLoader/WithLoader';

const PackageHeader = ({ attributes: { description }, isLoading }) => {
  const [wordLength, setWordLength] = useState(1000);

  return (
    (description && (
      <Grid hasGutter style={{ minHeight: 50 }}>
        <GridItem md={8} sm={12}>
          <WithLoader loading={isLoading} variant={WithLoaderVariants.spinner} centered>
            <Stack hasGutter>
              <StackItem />
              <StackItem style={{ whiteSpace: 'pre-line' }}>
                {description && truncateDescription(description, wordLength, setWordLength)}
              </StackItem>
            </Stack>
          </WithLoader>
        </GridItem>
      </Grid>
    )) || <></>
  );
};

PackageHeader.propTypes = {
  attributes: propTypes.object,
  isLoading: propTypes.bool,
};

export default PackageHeader;

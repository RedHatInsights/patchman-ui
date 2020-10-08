import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';
import { StackItem } from '@patternfly/react-core/dist/js/layouts/Stack/StackItem';
import propTypes from 'prop-types';
import React from 'react';
import { preserveNewlines } from '../../Utilities/Helpers';
import WithLoader, { WithLoaderVariants } from '../WithLoader/WithLoader';

const PackageHeader = ({ attributes, isLoading }) => {
    return (
        <Grid hasGutter style={{ minHeight: 50 }}>
            <GridItem md={8} sm={12}>
                <WithLoader
                    loading={isLoading}
                    variant={WithLoaderVariants.spinner}
                    centered
                >
                    <Stack hasGutter>
                        <StackItem />
                        <StackItem style={{ whiteSpace: 'pre-line' }}>
                            {
                                preserveNewlines(attributes.description)
                            }
                        </StackItem>
                    </Stack>
                </WithLoader>
            </GridItem>

        </Grid>
    );
};

PackageHeader.propTypes = {
    attributes: propTypes.object,
    isLoading: propTypes.bool
};

export default PackageHeader;

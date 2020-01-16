import { Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import propTypes from 'prop-types';
import React from 'react';
import PortalAdvisoryLink from '../../PresentationalComponents/Snippets/PortalAdvisoryLink';
import WithLoader, {
    WithLoaderVariants
} from '../../PresentationalComponents/WithLoader/WithLoader';

const AdvisoryHeader = ({ attributes, isLoading }) => {
    return (
        <Grid gutter="sm">
            <GridItem md={8} sm={12}>
                <WithLoader
                    loading={isLoading}
                    variant={WithLoaderVariants.spinner}
                    centered
                >
                    <Stack gutter="sm">
                        <StackItem />
                        <StackItem style={{ whiteSpace: 'pre-line' }}>
                            {attributes.description}
                        </StackItem>
                        <StackItem>
                            {attributes.public_date && (
                                <React.Fragment>
                                    {`Issued: ${processDate(
                                        attributes.public_date
                                    )}`}
                                    <br />
                                </React.Fragment>
                            )}
                            {attributes.modified_date && (
                                <React.Fragment>
                                    {`Modified: ${processDate(
                                        attributes.modified_date
                                    )}`}
                                </React.Fragment>
                            )}
                        </StackItem>
                        <StackItem>
                            <PortalAdvisoryLink advisory={attributes.id} />
                        </StackItem>
                    </Stack>
                </WithLoader>
            </GridItem>
        </Grid>
    );
};

AdvisoryHeader.propTypes = {
    attributes: propTypes.object,
    isLoading: propTypes.bool
};

export default AdvisoryHeader;

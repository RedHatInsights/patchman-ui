import { List, ListItem } from '@patternfly/react-core/dist/js/components/List';
import { Modal, ModalVariant } from '@patternfly/react-core/dist/js/components/Modal';
import { Text, TextContent, TextVariants } from '@patternfly/react-core/dist/js/components/Text/';
import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';
import { StackItem } from '@patternfly/react-core/dist/js/layouts/Stack/StackItem';
import SecurityIcon from '@patternfly/react-icons/dist/js/icons/security-icon';
import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import propTypes from 'prop-types';
import React from 'react';
import PortalAdvisoryLink from '../../PresentationalComponents/Snippets/PortalAdvisoryLink';
import WithLoader, { WithLoaderVariants } from '../../PresentationalComponents/WithLoader/WithLoader';
import { getSeverityById } from '../../Utilities/Helpers';
import InfoBox from '../InfoBox/InfoBox';
import AdvisorySeverityInfo from '../Snippets/AdvisorySeverityInfo';

const AdvisoryHeader = ({ attributes, isLoading }) => {
    const [isModalOpen, setModalOpen] = React.useState(false);
    const severityObject = getSeverityById(attributes.severity);
    const cveCount = attributes.cves && attributes.cves.length;
    const cvesLink = `${cveCount} CVE${cveCount !== 1 && 's' || ''} associated with this advisory`;
    return (
        <Grid hasGutter style={{ minHeight: 150 }}>
            <GridItem md={8} sm={12}>
                <WithLoader
                    loading={isLoading}
                    variant={WithLoaderVariants.spinner}
                    centered
                >
                    <Stack hasGutter>
                        <StackItem />
                        <StackItem style={{ whiteSpace: 'pre-line' }}>
                            {attributes.description &&
                                attributes.description.replace(
                                    new RegExp('\\n(?=[^\\n])', 'g'),
                                    ''
                                )}
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
                        <StackItem>
                            <TextContent>
                                <Text component={TextVariants.h2}>CVEs</Text>
                                {cveCount === 0 ? cvesLink :
                                    <a onClick={()=>setModalOpen(!isModalOpen)}>
                                        {cvesLink}
                                    </a>}
                            </TextContent>

                        </StackItem>
                    </Stack>
                    <Modal
                        variant={ModalVariant.small}
                        title="CVEs"
                        isOpen={isModalOpen}
                        onClose={()=>setModalOpen(false)}
                    ><List>
                            {attributes.cves && attributes.cves.map(cve =>
                                <ListItem key={cve}><a href={`${document.baseURI}insights/vulnerability/cves/${cve}`}>
                                    {cve}
                                </a>
                                </ListItem>
                            )}
                        </List>
                    </Modal>
                </WithLoader>
            </GridItem>
            <GridItem md={4} sm={12}>
                {severityObject.value !== 0 && (
                    <InfoBox
                        isLoading={isLoading}
                        title={severityObject.label}
                        color={severityObject.color}
                        text={
                            <AdvisorySeverityInfo severity={severityObject} />
                        }
                        content={<SecurityIcon size="lg" />}
                    />
                )}
            </GridItem>
        </Grid>
    );
};

AdvisoryHeader.propTypes = {
    attributes: propTypes.object,
    isLoading: propTypes.bool
};

export default AdvisoryHeader;

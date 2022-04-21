import React, { useEffect } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { register } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { setPageTitle, useFeatureFlag } from '../../Utilities/Hooks';
import { InventoryDetailHead, AppInfo, DetailWrapper } from '@redhat-cloud-services/frontend-components/Inventory';
import { Alert, Grid, GridItem, TextContent, Text } from '@patternfly/react-core';
import { fetchSystemDetailsAction } from '../../store/Actions/Actions';
import propTypes from 'prop-types';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { featureFlags } from '../../Utilities/constants';
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';

const InventoryDetail = ({ match }) => {
    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set);

    const [patchSetState, setBaselineState] = React.useState({
        isOpen: false,
        shouldRefresh: false,
        systemsIDs: []
    });

    const dispatch = useDispatch();
    const entityDetails = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails.entity
    );

    const { hasThirdPartyRepo, patchSetName } = useSelector(
        ({ entityDetails }) => entityDetails ?? {}
    );
    const entityId = match.params?.inventoryId;
    useEffect(() => {
        dispatch(fetchSystemDetailsAction(entityId));
        return () => {
            dispatch(clearNotifications());
        };
    }, []);

    const pageTitle = entityDetails && `${entityDetails.display_name} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    const showBaselineModal = () => {
        setBaselineState({ isOpen: true, systemsIDs: [entityId] });
    };

    return (
        <DetailWrapper
            onLoad={({ mergeWithDetail }) => {
                register({
                    ...mergeWithDetail(SystemDetailStore)
                });
            }}
        >
            {(patchSetState.isOpen && isPatchSetEnabled) &&
                <PatchSetWizard systemsIDs={patchSetState.systemsIDs} setBaselineState={setBaselineState} />}
            <Header
                title=""
                headerOUIA={'inventory-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.titlesPatchSystems),
                        to: paths.systems.to,
                        isActive: false
                    },
                    entityDetails && {
                        title: entityDetails.display_name,
                        isActive: true
                    }
                ]}
            >
                <InventoryDetailHead hideBack
                    showTags
                    actions={isPatchSetEnabled && [
                        {
                            title: intl.formatMessage(messages.titlesPatchSetAssignMultipleButton),
                            key: 'assign-to-patch-set',
                            onClick: showBaselineModal
                        }]}
                >
                    <Grid>
                        <GridItem>
                            <TextContent>
                                <Text>
                                    {`${intl.formatMessage(messages.labelsColumnsPatchSet)}: ${patchSetName}`}
                                </Text>
                            </TextContent>
                        </GridItem>
                        <GridItem>
                            {hasThirdPartyRepo &&
                                (<Alert className='pf-u-mt-md' isInline variant="info"
                                    title={intl.formatMessage(messages.textThirdPartyInfo)}>
                                </Alert>)
                            }
                        </GridItem>
                    </Grid>
                </InventoryDetailHead>
            </Header>
            <Main>
                <AppInfo />
            </Main>
        </DetailWrapper>
    );
};

InventoryDetail.propTypes = {
    match: propTypes.object
};

export default InventoryDetail;

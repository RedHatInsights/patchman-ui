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
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';;
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import usePatchSetState from '../../Utilities/usePatchSetState';
import { featureFlags } from '../../Utilities/constants';

const InventoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const { loaded, hasThirdPartyRepo, patchSetName } = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails || {}
    );

    const { display_name: displayName, insights_id: insightsID } = useSelector(
        ({ entityDetails }) => entityDetails?.entity ?? {}
    );
    const entityId = match.params?.inventoryId;

    const { patchSetState, setPatchSetState, openPatchSetAssignWizard, openUnassignSystemsModal } = usePatchSetState();

    useEffect(() => {
        dispatch(fetchSystemDetailsAction(entityId));
        return () => {
            dispatch(clearNotifications());
        };
    }, [patchSetState.shouldRefresh]);

    const pageTitle = displayName && `${displayName} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    const openPatchSetWizard = () => {
        openPatchSetAssignWizard(entityId);
    };

    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set);

    return (
        <DetailWrapper
            onLoad={({ mergeWithDetail }) => {
                register({
                    ...mergeWithDetail(SystemDetailStore)
                });
            }}
        >
            <PatchSetWrapper patchSetState={patchSetState} setPatchSetState={setPatchSetState} />
            <Header
                title=""
                headerOUIA={'inventory-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.titlesPatchSystems),
                        to: '/systems/',
                        isActive: false
                    },
                    displayName && {
                        title: displayName,
                        isActive: true
                    }
                ]}
            >
                {(!loaded || insightsID) && <InventoryDetailHead hideBack
                    showTags
                    actions={isPatchSetEnabled && [
                        {
                            title: intl.formatMessage(messages.titlesTemplateAssign),
                            key: 'assign-to-template',
                            onClick: openPatchSetWizard
                        },
                        {
                            title: intl.formatMessage(messages.titlesTemplateRemoveMultipleButton),
                            key: 'remove-from-template',
                            isDisabled: !patchSetName,
                            onClick: () => openUnassignSystemsModal([entityId])
                        }]}
                >
                    <Grid>
                        <GridItem>
                            {patchSetName && <TextContent>
                                <Text>
                                    {`${intl.formatMessage(messages.labelsColumnsTemplate)}: ${patchSetName}`}
                                </Text>
                            </TextContent>
                            }
                        </GridItem>
                        <GridItem>
                            {hasThirdPartyRepo &&
                                (<Alert className='pf-u-mt-md' isInline variant="info"
                                    title={intl.formatMessage(messages.textThirdPartyInfo)}>
                                </Alert>)
                            }
                        </GridItem>
                    </Grid>
                </InventoryDetailHead>}
            </Header>
            {(!insightsID && loaded)
                ? <ErrorHandler code={204} />
                : (<Main>
                    <AppInfo/>
                </Main>)}
        </DetailWrapper>);
};

InventoryDetail.propTypes = {
    match: propTypes.object
};

export default InventoryDetail;

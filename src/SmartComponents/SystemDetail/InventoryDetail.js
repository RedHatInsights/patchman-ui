import React, { useEffect } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { combineReducers } from 'redux';
import Header from '../../PresentationalComponents/Header/Header';
import { defaultReducers } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { setPageTitle, useFeatureFlag } from '../../Utilities/Hooks';
import { InventoryDetailHead, AppInfo, DetailWrapper } from '@redhat-cloud-services/frontend-components/Inventory';
import { Alert, Grid, GridItem, TextContent, Text } from '@patternfly/react-core';
import { fetchSystemDetailsAction } from '../../store/Actions/Actions';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';;
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import usePatchSetState from '../../Utilities/usePatchSetState';
import { featureFlags } from '../../Utilities/constants';
import { useParams } from 'react-router-dom';

const InventoryDetail = () => {
    const {  inventoryId } = useParams();
    const store = useStore();

    const dispatch = useDispatch();
    const { loaded, hasThirdPartyRepo, patchSetName } = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails || {}
    );

    const { display_name: displayName, insights_id: insightsID } = useSelector(
        ({ entityDetails }) => entityDetails?.entity ?? {}
    );

    const { patchSetState, setPatchSetState, openPatchSetAssignWizard, openUnassignSystemsModal } = usePatchSetState();

    useEffect(() => {
        dispatch(fetchSystemDetailsAction(inventoryId));
        return () => {
            dispatch(clearNotifications());
        };
    }, [patchSetState.shouldRefresh]);

    const pageTitle = displayName && `${displayName} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    const openPatchSetWizard = () => {
        openPatchSetAssignWizard(inventoryId);
    };

    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set);

    return (
        <DetailWrapper
            onLoad={({ mergeWithDetail }) => {
                store.replaceReducer(combineReducers({
                    ...defaultReducers,
                    ...mergeWithDetail(SystemDetailStore)
                }));
            }}
        >
            <PatchSetWrapper patchSetState={patchSetState} setPatchSetState={setPatchSetState} />
            <Header
                title=""
                headerOUIA={'inventory-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.titlesPatchSystems),
                        to: '/systems',
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
                            onClick: () => openUnassignSystemsModal([inventoryId])
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

export default InventoryDetail;

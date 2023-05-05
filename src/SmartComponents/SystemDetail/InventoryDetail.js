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
import { InventoryDetailHead, DetailWrapper } from '@redhat-cloud-services/frontend-components/Inventory';
import { Alert, Grid, GridItem, TextContent, Text } from '@patternfly/react-core';
import { fetchSystemDetailsAction } from '../../store/Actions/Actions';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';;
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import usePatchSetState from '../../Utilities/usePatchSetState';
import { featureFlags } from '../../Utilities/constants';
import { Link, useParams } from 'react-router-dom';
import SystemDetail from './SystemDetail';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const InventoryDetail = () => {
    const { inventoryId } = useParams();
    const store = useStore();
    const chrome = useChrome();

    const dispatch = useDispatch();

    const { hasThirdPartyRepo, patchSetName, patchSetId } = useSelector(
        ({ SystemDetailStore }) => SystemDetailStore
    );

    const { display_name: displayName } = useSelector(
        ({ entityDetails }) => entityDetails?.entity ?? {}
    );

    const { patchSetState, setPatchSetState, openAssignSystemsModal, openUnassignSystemsModal } = usePatchSetState();

    useEffect(() => {
        return () => {
            dispatch(clearNotifications());
        };
    }, []);

    useEffect(() => {
        dispatch(fetchSystemDetailsAction(inventoryId));
    }, [patchSetState.shouldRefresh]);

    const pageTitle = displayName && `${displayName} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    const isPatchSetEnabled = useFeatureFlag(featureFlags.patch_set, chrome);

    return (
        <DetailWrapper
            onLoad={({ mergeWithDetail }) => {
                store.replaceReducer(combineReducers({
                    ...defaultReducers,
                    ...mergeWithDetail(SystemDetailStore)
                }));
            }}
            inventoryId={inventoryId}
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
                <InventoryDetailHead
                    hideBack
                    showTags
                    inventoryId={inventoryId}
                    actions={isPatchSetEnabled && [
                        {
                            title: intl.formatMessage(messages.titlesTemplateAssign),
                            key: 'assign-to-template',
                            onClick: () => openAssignSystemsModal({ [inventoryId]: true })
                        },
                        {
                            title: intl.formatMessage(messages.titlesTemplateRemoveMultipleButton),
                            key: 'remove-from-template',
                            isDisabled: !patchSetName,
                            onClick: () => openUnassignSystemsModal([inventoryId])
                        }]}
                    //FIXME: remove this prop after inventory detail gets rid of activeApps in redux
                    appList={[]}
                >
                    <Grid>
                        {patchSetName && <GridItem>
                            <TextContent>
                                <Text>
                                    {intl.formatMessage(messages.labelsColumnsTemplate)}:
                                    <Link to={{ pathname: `../templates/${patchSetId}` }} className="pf-u-ml-xs">
                                        {patchSetName}
                                    </Link>
                                </Text>
                            </TextContent>
                        </GridItem>}
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
                <SystemDetail inventoryId={inventoryId} />
            </Main>
        </DetailWrapper>);
};

export default InventoryDetail;

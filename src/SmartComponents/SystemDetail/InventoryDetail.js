import React, { Fragment, useEffect } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { combineReducers } from 'redux';
import Header from '../../PresentationalComponents/Header/Header';
import { defaultReducers } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { InventoryDetailHead, DetailWrapper } from '@redhat-cloud-services/frontend-components/Inventory';
import { Alert, Grid, GridItem, TextContent, Text } from '@patternfly/react-core';
import { fetchSystemDetailsAction } from '../../store/Actions/Actions';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';;
import PatchSetWrapper from '../../PresentationalComponents/PatchSetWrapper/PatchSetWrapper';
import { usePatchSetState } from '../../Utilities/hooks';
import { useParams } from 'react-router-dom';
import SystemDetail from './SystemDetail';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { InsightsLink } from '@redhat-cloud-services/frontend-components/InsightsLink';

const InventoryDetail = () => {
    const { inventoryId } = useParams();
    const store = useStore();
    const dispatch = useDispatch();

    const { hasThirdPartyRepo, satelliteManaged, patchSetName, templateUUID } = useSelector(
        ({ SystemDetailStore }) => SystemDetailStore
    );

    const { display_name: displayName } = useSelector(
        ({ entityDetails }) => entityDetails?.entity ?? {}
    );

    const { patchSetState, setPatchSetState /*,openAssignSystemsModal, openUnassignSystemsModal */ } = usePatchSetState();

    useEffect(() => {
        dispatch(fetchSystemDetailsAction(inventoryId));

        return () => {
            dispatch(clearNotifications());
        };
    }, []);

    useEffect(() => {
        if (patchSetState.shouldRefresh) {
            dispatch(fetchSystemDetailsAction(inventoryId));
        }
    }, [patchSetState.shouldRefresh]);

    const chrome = useChrome();
    useEffect(() => {
        displayName && chrome.updateDocumentTitle(`${displayName} - Systems - Patch | RHEL`, true);
    }, [chrome, displayName]);

    // const { hasAccess: hasTemplateAccess } = usePermissionsWithContext([
    //     'patch:*:*',
    //     'patch:template:write'
    // ]);

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
                    actions={[
                        // {
                        //     title: intl.formatMessage(messages.titlesTemplateAssign),
                        //     key: 'assign-to-template',
                        //     isDisabled: !hasTemplateAccess || satelliteManaged,
                        //     onClick: () => openAssignSystemsModal({ [inventoryId]: true })
                        // },
                        // {
                        //     title: intl.formatMessage(messages.titlesTemplateRemoveMultipleButton),
                        //     key: 'remove-from-template',
                        //     isDisabled: !hasTemplateAccess || !patchSetName || satelliteManaged,
                        //     onClick: () => openUnassignSystemsModal([inventoryId])
                        // }
                    ]}
                    //FIXME: remove this prop after inventory detail gets rid of activeApps in redux
                    appList={[]}
                >
                    <Grid>
                        {patchSetName && <GridItem>
                            <TextContent>
                                <Text>
                                    {intl.formatMessage(messages.labelsColumnsTemplate)}:{' '}
                                    <InsightsLink app="content" to={{ pathname: `/templates/${templateUUID}/details` }}>
                                        {patchSetName}
                                    </InsightsLink>
                                </Text>
                            </TextContent>
                        </GridItem>}
                        <GridItem>
                            {satelliteManaged
                                ? <Fragment>
                                    <Alert
                                        className='pf-v5-u-mt-md'
                                        isInline
                                        variant="info"
                                        title="This system has content managed by Satellite. Installable updates are
                                            current as of the last time the system checked-in with Red Hat Insights."
                                    />
                                    <Alert
                                        className='pf-v5-u-mt-md'
                                        isInline
                                        variant="warning"
                                        title="This system has content managed by Satellite. For accurate reporting of
                                            installable updates, check in to Red Hat Insights with the --build-packagecache
                                            option."
                                    >
                                        <a
                                            href="https://access.redhat.com/solutions/7041171"
                                            target="__blank"
                                            rel="noopener noreferrer"
                                        >
                                            Read more
                                        </a>
                                    </Alert>
                                </Fragment>
                                : hasThirdPartyRepo && <Alert
                                    className='pf-v5-u-mt-md'
                                    isInline
                                    variant="info"
                                    title="This system has content that is managed by repositories other than the Red Hat CDN"
                                />
                            }
                        </GridItem>
                    </Grid>
                </InventoryDetailHead>
            </Header>
            <Main>
                <SystemDetail
                    inventoryId={inventoryId}
                    shouldRefresh={patchSetState.shouldRefresh}
                />
            </Main>
        </DetailWrapper>);
};

export default InventoryDetail;

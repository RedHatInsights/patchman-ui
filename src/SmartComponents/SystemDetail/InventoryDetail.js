import React, { useEffect } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { register } from '../../store';
import { SystemDetailStore } from '../../store/Reducers/SystemDetailStore';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { setPageTitle } from '../../Utilities/Hooks';
import { InventoryDetailHead, AppInfo, DetailWrapper } from '@redhat-cloud-services/frontend-components/Inventory';
import { Alert, Grid, GridItem, TextContent, Text } from '@patternfly/react-core';
import { fetchSystemDetailsAction } from '../../store/Actions/Actions';
import propTypes from 'prop-types';
import { clearNotifications } from '@redhat-cloud-services/frontend-components-notifications/redux';;
import PatchSetWizard from '../PatchSetWizard/PatchSetWizard';
import UnassignSystemsModal from '../Modals/UnassignSystemsModal';
import ErrorHandler from '../../PresentationalComponents/Snippets/ErrorHandler';

const InventoryDetail = ({ match }) => {
    const [unassignSystemsModalState, setUnassignSystemsModalState] = React.useState({
        isUnassignSystemsModalOpen: false,
        systemsIDs: [],
        shouldRefresh: false
    });
    const [patchSetState, setBaselineState] = React.useState({
        isOpen: false,
        shouldRefresh: false,
        systemsIDs: []
    });

    const dispatch = useDispatch();
    const { loaded } = useSelector(
        ({ entityDetails }) => entityDetails && entityDetails || {}
    );

    const { hasThirdPartyRepo, patchSetName, display_name: displayName, insights_id: insightsID } = useSelector(
        ({ entityDetails }) => entityDetails?.entity ?? {}
    );
    const entityId = match.params?.inventoryId;
    useEffect(() => {
        dispatch(fetchSystemDetailsAction(entityId));
        return () => {
            dispatch(clearNotifications());
        };
    }, [patchSetState.shouldRefresh, unassignSystemsModalState.shouldRefresh]);

    const pageTitle = displayName && `${displayName} - ${intl.formatMessage(messages.titlesSystems)}`;
    setPageTitle(pageTitle);

    const showBaselineModal = () => {
        setBaselineState({ isOpen: true, systemsIDs: [entityId] });
    };

    const openUnassignSystemsModal = (systemsIDs) => {
        setUnassignSystemsModalState({
            isUnassignSystemsModalOpen: true,
            systemsIDs
        });
    };

    return (<DetailWrapper
        onLoad={({ mergeWithDetail }) => {
            register({
                ...mergeWithDetail(SystemDetailStore)
            });
        }}
    >
        {(unassignSystemsModalState.isUnassignSystemsModalOpen) && <UnassignSystemsModal
            unassignSystemsModalState={unassignSystemsModalState}
            setUnassignSystemsModalOpen={setUnassignSystemsModalState}
            systemsIDs={unassignSystemsModalState.systemsIDs}
        />}
        {(patchSetState.isOpen) &&
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
                displayName && {
                    title: displayName,
                    isActive: true
                }
            ]}
        >
            {(!loaded || insightsID) && <InventoryDetailHead hideBack
                showTags
                actions={[
                    {
                        title: intl.formatMessage(messages.titlesPatchSetAssign),
                        key: 'assign-to-patch-set',
                        onClick: showBaselineModal
                    },
                    {
                        title: intl.formatMessage(messages.titlesPatchSetRemoveMultipleButton),
                        key: 'remove-from-patch-set',
                        isDisabled: !patchSetName,
                        onClick: () => openUnassignSystemsModal([entityId])
                    }]}
            >
                <Grid>
                    <GridItem>
                        {patchSetName && <TextContent>
                            <Text>
                                {`${intl.formatMessage(messages.labelsColumnsPatchSet)}: ${patchSetName}`}
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

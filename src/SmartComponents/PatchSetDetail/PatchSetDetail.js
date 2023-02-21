import { Main } from '@redhat-cloud-services/frontend-components/Main';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import messages from '../../Messages';
import Header from '../../PresentationalComponents/Header/Header';
//import { NoSmartManagement } from '../../PresentationalComponents/Snippets/EmptyStates';
//import TableView from '../../PresentationalComponents/TableView/TableView';
//import { useEntitlements } from '../../Utilities/Hooks';
import { fetchPatchSetAction } from '../../store/Actions/Actions';
import { Dropdown, DropdownItem, KebabToggle, Skeleton } from '@patternfly/react-core';

const PatchSetDetail = () => {
    //const getEntitlements = useEntitlements();
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const patchSetId = history.location.pathname.split('/')[2];

    const [isOpen, setIsOpen] = useState(false);

    // const [hasSmartManagement, setSmartManagement] = React.useState(true);

    const templateDetails = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore
    );

    const status = useSelector(
        ({ PatchSetDetailStore }) => PatchSetDetailStore.status
    );

    useEffect(() => {
        /*
        getEntitlements().then((entitelements) => {
            setSmartManagement(
                entitelements?.smart_management?.is_entitled
            );
        });
        */

        dispatch(fetchPatchSetAction(patchSetId));
    }, []);

    const dropdownItems = [
        <DropdownItem
            key="delete-patch-set"
            component="button"
        >
            Delete
        </DropdownItem>
    ];

    return (
        <React.Fragment>
            <Header
                title={status.isLoading ? <Skeleton size={Skeleton.md} /> : templateDetails.data.attributes.name}
                headerOUIA={'template-details'}
                breadcrumbs={[
                    {
                        title: intl.formatMessage(messages.templateDetailHeaderBreadcrumb),
                        to: '/templates',
                        isActive: false
                    },
                    {
                        title: templateDetails.data.attributes.name,
                        isActive: true
                    }
                ]}
                actions={
                    <Dropdown
                        onSelect={() => setIsOpen(false)}
                        toggle={<KebabToggle id="toggle-kebab" onToggle={() => setIsOpen(true)} />}
                        isOpen={isOpen}
                        isPlain
                        dropdownItems={dropdownItems}
                    />
                }
            >
                <br />
                Template description: [[description]] <br />
                Red Hat repositories up to: [[date]] <br />
                Created by: [[user]] <br />
                Published: [[date]] <br />
                Last edited: [[date]] <br />
            </Header>
            <Main>
                {/*
                {hasSmartManagement ? <TableView
                    columns={patchSetColumns}
                    compact
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    onSort={onSort}
                    selectedRows={IS_SELECTION_ENABLED && selectedRows}
                    onSelect={IS_SELECTION_ENABLED && onSelect}
                    sortBy={sortBy}
                    apply={apply}
                    tableOUIA={'patch-set-table'}
                    paginationOUIA={'patch-set-pagination'}
                    store={{ rows, metadata, status, queryParams }}
                    actionsConfig={(patchSets?.length > 0) && actionsConfig}
                    filterConfig={filterConfig}
                    searchChipLabel={intl.formatMessage(messages.labelsFiltersSearchTemplateTitle)}
                    CreatePatchSetButton={CreatePatchSetButton}
                    actionsToggle={!hasAccess ? CustomActionsToggle : null}
                /> : <NoSmartManagement />}
                */}
            </Main>
        </React.Fragment >);
};

export default PatchSetDetail;

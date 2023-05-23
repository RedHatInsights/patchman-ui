import React from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table';
import {
    EllipsisVIcon
} from '@patternfly/react-icons';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const CreatePatchSetButton = (setPatchSetState, hasAccess) => () =>
    !hasAccess ?
        <Tooltip content='For editing access, contact your administrator.'>
            <Button key='createButton' isAriaDisabled >
                {intl.formatMessage(messages.labelsButtonCreateTemplate)}
            </Button>
        </Tooltip>
        :
        (<Button key='createButton' onClick={() => setPatchSetState({ isPatchSetWizardOpen: true })}>
            {intl.formatMessage(messages.labelsButtonCreateTemplate)}
        </Button>);

export const patchSetColumns = [
    {
        key: 'name',
        title: 'Name',
        transforms: [sortable]
    },
    {
        key: 'systems',
        title: 'Systems applied',
        transforms: [sortable]
    },
    {
        key: 'last_edited',
        title: 'Last edited',
        transforms: [sortable]
    },
    {
        key: 'published',
        title: 'Published',
        transforms: [sortable]
    },
    {
        key: 'creator',
        title: 'Created by',
        transforms: [sortable]
    }
];

export const patchSetRowActions = (openPatchSetEditModal, handlePatchSetDelete) => [
    {
        title: intl.formatMessage(messages.labelsButtonEditTemplate),
        onClick: (_event, _rowId, rowData) => {
            openPatchSetEditModal(rowData?.id);
        }
    },
    {
        title: intl.formatMessage(messages.labelsButtonRemoveTemplate),
        onClick: (_event, _rowId, rowData) => {
            handlePatchSetDelete(rowData);
        }
    }
];

export const patchSetDetailRowActions = (handleSystemUnassign) => [
    {
        title: intl.formatMessage(messages.titlesTemplateRemoveFromSystems, { systemsCount: 1 }),
        onClick: (_event, _rowId, rowData) => {
            handleSystemUnassign([rowData.id]);
        }
    }

];

export const CustomActionsToggle = () => <Tooltip content='For editing access, contact your administrator.'>
    <Button
        isAriaDisabled
        variant="plain"
        aria-label="plain kebab"
    >
        <EllipsisVIcon />
    </Button>
</Tooltip>;

// TODO: Failure notifications
export const patchSetUnassignSystemsNotifications = (systemsCount) => ({
    success: {
        title: `Systems succesfully removed from this Patch template.`,
        description: `${systemsCount} ${systemsCount > 1 ? 'systems' : 'system'} removed from Patch template(s)`,
        variant: 'success'
    }
});

export const patchSetAssignSystemsNotifications = (systemsCount) => ({
    success: {
        title: `Systems succesfully applied to this Patch template.`,
        description: `${systemsCount} ${systemsCount > 1 ? 'systems' : 'system'} added to Patch template(s)`,
        variant: 'success'
    }
});

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
        transforms: [sortable],
        props: {
            width: 50
        }
    },
    {
        key: 'systems',
        title: 'Systems',
        transforms: [sortable],
        props: {
            width: 50
        }
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

export const CustomActionsToggle = () => <Tooltip content='For editing access, contact your administrator.'>
    <Button
        isAriaDisabled
        variant="plain"
        aria-label="plain kebab"
    >
        <EllipsisVIcon />
    </Button>
</Tooltip>;

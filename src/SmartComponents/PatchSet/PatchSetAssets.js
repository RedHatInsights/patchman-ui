import React from 'react';
import { Button } from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table/dist/js';

import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const createPatchSetButton = (setPatchSetState) => () =>
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
        title: 'Edit template',
        onClick: (_event, _rowId, rowData) => {
            openPatchSetEditModal(rowData?.id);
        }
    },
    {
        title: 'Remove template',
        onClick: (_event, _rowId, rowData) => {
            handlePatchSetDelete(rowData);
        }
    }
];

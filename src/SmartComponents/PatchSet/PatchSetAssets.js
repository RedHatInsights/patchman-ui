import React from 'react';
import { Button } from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table/dist/js';

import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const createPatchSetButton = (setWizardState) => () =>
    (<Button key='createButton' onClick={() => setWizardState({ isOpen: true })}>
        {intl.formatMessage(messages.labelsButtonCreatePatchSet)}
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

export const patchSetRowActions = (showBaselineModal, handlePatchSetDelete) => [
    {
        title: 'Edit patch set',
        onClick: (_event, _rowId, rowData) => {
            showBaselineModal(rowData);
        }
    },
    {
        title: 'Remove patch set',
        onClick: (_event, _rowId, rowData) => {
            handlePatchSetDelete(rowData);
        }
    }
];

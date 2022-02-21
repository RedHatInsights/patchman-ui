import React from 'react';
import { Button } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const CreatePatchSet = () => {
    return (<Button>
        {intl.formatMessage(messages.labelsButtonCreatePatchSet)}
    </Button>);
};

export const EditPatchSet = () =>{
    return (< Button variant="secondary" >
        {intl.formatMessage(messages.labelsButtonEditPatchSet)}
    </Button >);
};

export const patchSetColumns = [
    {
        key: 'name',
        title: 'Name',
        props: {
            width: 50
        }
    },
    {
        key: 'systems',
        title: 'Systems',
        props: {
            width: 50
        }
    }
];

export const patchSetRowActions = [
    {
        title: 'Edit patch set',
        // eslint-disable-next-line no-unused-vars
        onClick: (_event, _rowId, _rowData) => {
            console.log('edit');
        }
    },
    {
        title: 'Assign patch set',
        // eslint-disable-next-line no-unused-vars
        onClick: (_event, _rowId, _rowData) => {
            console.log('assign');
        }
    },
    {
        title: 'Remove patch set',
        // eslint-disable-next-line no-unused-vars
        onClick: (_event, _rowId, _rowData) => {
            console.log('remove');
        }
    }
];

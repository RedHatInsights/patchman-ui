import React, { useState, useEffect } from 'react';
import {
    FormGroup,
    TextInput
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';

const NameField = (props) => {
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const values = formOptions.getState()?.values;

    const [name, setName] = useState(values?.name);

    useEffect(() => {
        setName(values.name);
    }, [values.name]);

    return (
        <FormGroup fieldId="name" label={intl.formatMessage(messages.labelsColumnsName)} isRequired>
            <TextInput
                type="text"
                isRequired
                value={name}
                onChange={(val) => {
                    input.onChange(val);
                    setName(val);
                }}
                aria-label="name"
                autoFocus
            />
        </FormGroup>
    );
};

export default NameField;

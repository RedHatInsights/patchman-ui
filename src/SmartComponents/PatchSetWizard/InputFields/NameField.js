import React, { useState } from 'react';
import {
    FormGroup,
    TextInput
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

const NameField = (props) => {
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const values = formOptions.getState()?.values;

    const [name, setName] = useState(values?.name);
    return (
        <FormGroup fieldId="name" label="Name" isRequired>
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

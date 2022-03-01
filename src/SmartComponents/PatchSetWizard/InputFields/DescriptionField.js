import React, { useState, useEffect } from 'react';
import { FormGroup, TextInput } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

const DescriptionField = (props) => {
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const values = formOptions.getState()?.values;

    const [description, setDescription] = useState(values?.description);

    useEffect(() => {
        setDescription(values.description);
    }, [values.description]);

    return (
        <FormGroup fieldId="description" label="Description">
            <TextInput
                type="text"
                isRequired
                value={description}
                onChange={(val) => {
                    input.onChange(val);
                    setDescription(val);
                }}
                aria-label="description"
            />
        </FormGroup>
    );
};

export default DescriptionField;

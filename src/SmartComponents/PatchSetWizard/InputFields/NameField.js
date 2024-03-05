import React, { useState, useEffect } from 'react';
import {
    FormGroup,
    TextInput
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';
import { shallowEqual, useSelector } from 'react-redux';

const NameField = (props) => {
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const values = formOptions.getState()?.values;

    const [name, setName] = useState(values?.name);

    const { takenBaselineNames, takenBaselineNamesLoading } =
        useSelector(({ SpecificPatchSetReducer }) => SpecificPatchSetReducer, shallowEqual);

    useEffect(() => {
        setName(values.name);
    }, [values.name]);

    useEffect(() => {
        formOptions.change('takenBaselineNames', takenBaselineNames);
        formOptions.change('takenBaselineNamesLoading', takenBaselineNamesLoading);
    }, [takenBaselineNames, takenBaselineNamesLoading]);

    const validateName = () => {
        if (name === undefined || name === values.previousName) {
            return;
        }

        if (takenBaselineNames.includes(name)) {
            return 'error';
        }
    };

    return (
        <FormGroup
            fieldId="name"
            label={intl.formatMessage(messages.labelsColumnsName)}
            isRequired
            helperTextInvalid={intl.formatMessage(messages.templateWizardValidateNameTaken)}
            validated={validateName()}
        >
            <TextInput
                type="text"
                isRequired
                value={name}
                onChange={(_event, val) => {
                    input.onChange(val);
                    setName(val);
                }}
                aria-label="name"
                autoFocus
                validated={validateName()}
            />
        </FormGroup>
    );
};

export default NameField;

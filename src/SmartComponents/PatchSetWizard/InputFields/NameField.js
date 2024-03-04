import React, { useState, useEffect } from 'react';
import {
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
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
    const [validated, setValidated] = useState();

    const { takenBaselineNames, takenBaselineNamesLoading } = useSelector(
        ({ SpecificPatchSetReducer }) => SpecificPatchSetReducer,
        shallowEqual
    );

    useEffect(() => {
        const validateName = () => {
            if (
                values.name === undefined ||
                values.name === values.previousName
            ) {
                return 'default';
            }

            if (takenBaselineNames.includes(values.name)) {
                return 'error';
            }

            return 'success';
        };

        setName(values.name);
        setValidated(validateName());
    }, [values.name]);

    useEffect(() => {
        formOptions.change('takenBaselineNames', takenBaselineNames);
        formOptions.change(
            'takenBaselineNamesLoading',
            takenBaselineNamesLoading
        );
    }, [takenBaselineNames, takenBaselineNamesLoading]);

    return (
        <FormGroup
            fieldId="name"
            label={intl.formatMessage(messages.labelsColumnsName)}
            isRequired
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
                validated={validated}
            />
            {validated === 'error' && (
                <FormHelperText>
                    <HelperText>
                        <HelperTextItem variant={validated}>
                            {intl.formatMessage(
                                messages.templateWizardValidateNameTaken
                            )}
                        </HelperTextItem>
                    </HelperText>
                </FormHelperText>
            )}
        </FormGroup>
    );
};

export default NameField;

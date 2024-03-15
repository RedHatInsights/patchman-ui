import React, { useState, useEffect } from 'react';
import {
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    TextInput,
    Spinner
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';
import { useFetchAllTemplateData } from '../WizardAssets';
import { fetchPatchSets } from '../../../Utilities/api';

const NameField = (props) => {
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const values = formOptions.getState()?.values;

    const [name, setName] = useState(values?.name);
    const [validated, setValidated] = useState();
    const [takenTemplateNames, setTakenTemplateNames] = useState([]);
    const [areTakenTemplateNamesLoading, setAreTakenTemplateNamesLoading] = useState(true);

    const fetchTemplateNames = useFetchAllTemplateData(
        fetchPatchSets,
        ({ attributes }) => attributes.name
    );

    useEffect(() => {
        fetchTemplateNames().then(({ data, isLoading }) => {
            setTakenTemplateNames(data);
            setAreTakenTemplateNamesLoading(isLoading);
        });
    }, []);

    useEffect(() => {
        const validateName = () => {
            if (
                values.name === undefined ||
                values.name === values.previousName
            ) {
                return 'default';
            }

            if (takenTemplateNames.includes(values.name)) {
                return 'error';
            }

            return 'success';
        };

        setName(values.name);
        setValidated(validateName());
    }, [values.name, takenTemplateNames]);

    useEffect(() => {
        formOptions.change('takenTemplateNames', takenTemplateNames);
        formOptions.change('areTakenTemplateNamesLoading', areTakenTemplateNamesLoading);
    }, [takenTemplateNames, areTakenTemplateNamesLoading]);

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
            {(validated === 'error' || areTakenTemplateNamesLoading) && (
                <FormHelperText>
                    <HelperText>
                        {areTakenTemplateNamesLoading
                            ? <Spinner size="md" />
                            : <HelperTextItem variant={validated}>
                                {intl.formatMessage(
                                    messages.templateWizardValidateNameTaken
                                )}
                            </HelperTextItem>
                        }
                    </HelperText>
                </FormHelperText>
            )}
        </FormGroup>
    );
};

export default NameField;

import React, { useState, useEffect } from 'react';
import {
    FormGroup,
    DatePicker,
    Flex,
    FlexItem
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import dateValidator from '../../../Utilities/dateValidator';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';

const ToDateField = (props) => {
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const values = formOptions.getState()?.values;

    const [toDate, setToDate] = useState(values?.toDate);

    useEffect(() => {
        setToDate(values.toDate);
    }, [values.toDate]);

    return (
        <FormGroup fieldId="toDate" label="Patch template date" isRequired>
            <Flex>
                <FlexItem lg={2} md={2}>
                    Upto
                </FlexItem>
                <FlexItem lg={10} md={10}>
                    <DatePicker
                        isRequired
                        value={toDate}
                        onChange={(val) => {
                            input.onChange(val);
                            setToDate(val);
                        }}
                        popoverProps={{ position: 'right' }}
                        aria-label="toDate"
                        validators={[dateValidator]}
                        invalidFormatText={intl.formatMessage(messages.labelsErrorInvalidDate)}
                    />
                </FlexItem>
            </Flex>
        </FormGroup>
    );
};

export default ToDateField;

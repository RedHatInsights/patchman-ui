import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
    Text,
    TextContent,
    Stack,
    StackItem,
    Radio,
    TextVariants
} from '@patternfly/react-core';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';
import SelectExistingSets from '../InputFields/SelectExistingSets';
import ConfigurationFields from '../InputFields/ConfigurationFields';

const ConfigurationStepFields = ({ systemsIDs, patchSetID }) => {
    const formOptions = useFormApi();
    const shouldShowRadioButtons = (!patchSetID && systemsIDs?.length !== 0) || false;

    const [shouldApplyExisting, setShouldApplyExisting] = useState(false);
    const [shouldCreateNew, setShouldCreateNew] = useState(true);
    const [selectedPatchSet, setSelectedPatchSet] = useState([]);

    const { patchSet, status } = useSelector(({ SpecificPatchSetReducer }) => SpecificPatchSetReducer, shallowEqual);

    const handleRadioChange = () => {
        setShouldCreateNew(!shouldCreateNew);
        setShouldApplyExisting(!shouldApplyExisting);
    };

    useEffect(() => {
        if (patchSetID) {
            const { name, description } = patchSet;

            formOptions.change('name', name);
            formOptions.change('description', description);
        }
    }, [patchSet]);

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text component="h2">
                        {intl.formatMessage(messages.templateDetailStepTitle)}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                {intl.formatMessage(messages.templateDetailStepText)}
            </StackItem>
            {shouldShowRadioButtons && <TextContent style={{ marginTop: '-15px' }}>
                <Text component={TextVariants.p}>
                    {intl.formatMessage(
                        messages.textTemplateSelectedSystems,
                        { systemsCount: systemsIDs.length, b: (...chunks) => <b>{chunks}</b> }
                    )}
                </Text>
            </TextContent>}
            <StackItem>
                <Stack hasGutter>
                    {shouldShowRadioButtons && (<><StackItem>
                        <Radio
                            isChecked={shouldApplyExisting}
                            name="radio"
                            onChange={handleRadioChange}
                            label={intl.formatMessage(messages.textTemplateAddToExisting)}
                            id="existing-template"
                        />
                    </StackItem>
                    <StackItem>
                        {shouldApplyExisting ? <SelectExistingSets
                            setSelectedPatchSet={setSelectedPatchSet}
                            selectedSets={selectedPatchSet}
                            systems={systemsIDs}
                        /> : null}
                    </StackItem>
                    <StackItem>
                        <Radio
                            isChecked={shouldCreateNew}
                            name="radio"
                            onChange={handleRadioChange}
                            label={intl.formatMessage(messages.textTemplateCreateNew)}
                            id="new-template"
                        />
                    </StackItem></>) || null}
                    <StackItem>
                        {shouldCreateNew ? <ConfigurationFields
                            isLoading={patchSetID && status.isLoading}
                        /> : null}
                    </StackItem>
                </Stack>
            </StackItem>
        </Stack>
    );
};

ConfigurationStepFields.propTypes = {
    systemsIDs: propTypes.array,
    patchSetID: propTypes.string
};
export default ConfigurationStepFields;

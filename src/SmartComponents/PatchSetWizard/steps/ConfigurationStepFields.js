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
import SelectExistingSets from '../InputFields/SelectExistingSets';
import ConfigurationFields from '../InputFields/ConfigurationFields';

import { convertIsoToDate } from '../../../Utilities/Helpers';

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
            const { name, description, config: { to_time: toDate } } = patchSet;

            formOptions.change('name', name);
            formOptions.change('description', description);
            formOptions.change('toDate', convertIsoToDate(toDate));
        }
    }, [patchSet]);

    return (
        <Stack hasGutter>
            {shouldShowRadioButtons && <TextContent style={{ marginTop: '-15px' }}>
                <Text component={TextVariants.p}>
                    You selected <b>{systemsIDs.length} systems</b>
                </Text>
            </TextContent>}
            <StackItem>
                <Stack hasGutter>
                    {shouldShowRadioButtons && (<><StackItem>
                        <Radio
                            isChecked={shouldApplyExisting}
                            name="radio"
                            onChange={handleRadioChange}
                            label="Add to existing patch set"
                            id="existing-set"
                            value=""
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
                            label={'Create new patch set'}
                            id="new-set"
                            value=""
                        />
                    </StackItem></>) || null}
                    <StackItem>
                        {shouldCreateNew ? <ConfigurationFields
                            isLoading={status.isLoading}
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

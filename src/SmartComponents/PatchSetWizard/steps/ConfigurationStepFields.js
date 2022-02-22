import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
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
import { fetchPatchSetsAction } from '../../../store/Actions/Actions';

const ConfigurationStepFields = ({ systemsIDs, ...props }) => {
    const dispatch = useDispatch();
    const formOptions = useFormApi();
    const { input } = useFieldApi(props);

    const [shouldApplyExisting, setShouldApplyExisting] = useState(false);
    const [shouldCreateNew, setShouldCreateNew] = useState(true);
    const [selectedPatchSet, setSelectedPatchSet] = useState([]);

    const { rows, loading } = useSelector(({ PatchSetsStore }) => PatchSetsStore, shallowEqual);

    useEffect(() => {
        (!loading && !rows?.length) && dispatch(fetchPatchSetsAction());
    }, []);

    const handleRadioChange = () => {
        setShouldCreateNew(!shouldCreateNew);
        setShouldApplyExisting(!shouldApplyExisting);
    };

    return (
        <Stack hasGutter>
            <TextContent style={{ marginTop: '-15px' }}>
                <Text component={TextVariants.p}>
                    You selected <b>{systemsIDs.length} systems</b>
                </Text>
            </TextContent>
            <StackItem>
                <Stack hasGutter>
                    <StackItem>
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
                            patchSets={rows}
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
                            label="Create new patch set"
                            id="new-set"
                            value=""
                        />
                    </StackItem>
                    <StackItem>
                        {shouldCreateNew ? <ConfigurationFields
                            input={input}
                            formOptions={formOptions}
                        /> : null}
                    </StackItem>
                </Stack>
            </StackItem>
        </Stack>
    );
};

ConfigurationStepFields.propTypes = {
    systemsIDs: propTypes.array
};
export default ConfigurationStepFields;

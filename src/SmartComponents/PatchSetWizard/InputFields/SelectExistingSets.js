import React, { useState, useMemo } from 'react';
import propTypes from 'prop-types';
import { Select, SelectOption, SelectVariant, FormGroup } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const SelectExistingSets = ({ patchSets, setSelectedPatchSet, selectedSets, systems }) => {
    const formOptions = useFormApi();
    const [isOpen, setOpen] = useState(true);

    const patchOptions = useMemo(() =>
        patchSets.map(set => <SelectOption key={set.id} value={set.name} />),
    [patchSets]);

    const handleOpen = () => {
        setOpen(!isOpen);
    };

    const handleSelect = (_, selected) =>{
        setOpen(false);
        setSelectedPatchSet(selected);

        const selectedSet = patchSets.filter(set => set.name === selected);
        formOptions.change('existing_patch_set', { name: selectedSet[0].name, systems });
    };

    return (
        <FormGroup fieldId="existing_patch_set" label="Choose a Patch set" isRequired>
            <Select
                variant={SelectVariant.single}
                aria-label="Select Input"
                onSelect={handleSelect}
                placeholderText="Select an option"
                selections={selectedSets}
                onToggle={handleOpen}
                isOpen={isOpen}
                isDisabled={false}
            >
                {patchOptions}
            </Select>
        </FormGroup >
    );
};

SelectExistingSets.propTypes = {
    patchSets: propTypes.array,
    setSelectedPatchSet: propTypes.func,
    selectedSets: propTypes.array,
    systems: propTypes.array
};
export default SelectExistingSets;

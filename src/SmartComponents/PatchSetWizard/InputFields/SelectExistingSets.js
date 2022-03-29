import React, { useState, useMemo, useEffect } from 'react';
import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectOption, SelectVariant, FormGroup, Spinner } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { fetchPatchSetsAction, changePatchSetsParams, clearPatchSetsAction } from '../../../store/Actions/Actions';

const SelectExistingSets = ({ setSelectedPatchSet, selectedSets, systems }) => {
    const dispatch = useDispatch();
    const formOptions = useFormApi();
    const [isOpen, setOpen] = useState(true);

    const rows = useSelector(({ PatchSetsStore }) => PatchSetsStore.rows);
    const queryParams = useSelector(({ PatchSetsStore }) => PatchSetsStore.queryParams);
    const status = useSelector(({ PatchSetsStore }) => PatchSetsStore.status);

    useEffect(() => {
        dispatch(fetchPatchSetsAction({ ...queryParams, limit: 10 }));

        return () => dispatch(clearPatchSetsAction());
    }, [queryParams.page]);

    const patchOptions = useMemo(() =>{
        if (status.isLoading) {
            return [<SelectOption key='loading'><Spinner size="md"/></SelectOption>];
        }

        return rows.map(set => <SelectOption key={set.id} value={set.name} />);
    }, [rows, status.isLoading]);

    const handleOpen = () => {
        setOpen(!isOpen);
    };

    const handleSelect = (_, selected) =>{
        setOpen(false);
        setSelectedPatchSet(selected);

        const selectedSet = rows.filter(set => set.name === selected);
        if (selectedSet.length === 1) {
            formOptions.change('existing_patch_set', { name: selectedSet[0]?.name, systems, id: selectedSet[0]?.id });
        }

    };

    const onViewMoreClick = () => {
        dispatch(changePatchSetsParams({ ...queryParams, page: queryParams.page + 1 }));
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
                loadingVariant={{
                    text: 'View more',
                    onClick: onViewMoreClick
                }}
            >
                {patchOptions}
            </Select>
        </FormGroup >
    );
};

SelectExistingSets.propTypes = {
    setSelectedPatchSet: propTypes.func,
    selectedSets: propTypes.array,
    systems: propTypes.array
};
export default SelectExistingSets;

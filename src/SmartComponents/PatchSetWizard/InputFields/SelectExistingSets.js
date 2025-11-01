import '../../../App.scss';
import React, { useState, useMemo, useEffect } from 'react';
import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { AngleLeftIcon, AngleRightIcon } from '@patternfly/react-icons';
import {
  FormGroup,
  Spinner,
  Flex,
  FlexItem,
  Button,
  Icon,
  Select,
  SelectOption,
  MenuToggle,
  SelectList,
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  fetchPatchSetsAction,
  changePatchSetsParams,
  clearPatchSetsAction,
} from '../../../store/Actions/Actions';
import { intl } from '../../../Utilities/IntlProvider';
import messages from '../../../Messages';

const SelectPagination = ({ changePage, page, perPage, totalItems }) => {
  const openNextPage = () => changePage(page + 1);
  const openPrevPage = () => changePage(page - 1);

  return (
    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
      <FlexItem>
        <Button
          icon={
            <Icon>
              <AngleLeftIcon />
            </Icon>
          }
          variant='plain'
          aria-label='prev'
          isDisabled={page === 1}
          onClick={openPrevPage}
        />
      </FlexItem>
      <FlexItem>
        <Button
          icon={
            <Icon>
              <AngleRightIcon />
            </Icon>
          }
          variant='plain'
          aria-label='next'
          isDisabled={totalItems < page * perPage}
          onClick={openNextPage}
        />
      </FlexItem>
    </Flex>
  );
};

const SelectExistingSets = ({
  setSelectedPatchSet,
  selectedSets,
  systems,
  selectCallback = () => {},
}) => {
  const dispatch = useDispatch();
  const formOptions = useFormApi();
  const [isOpen, setOpen] = useState(false);

  const rows = useSelector(({ PatchSetsStore }) => PatchSetsStore.rows);
  const queryParams = useSelector(({ PatchSetsStore }) => PatchSetsStore.queryParams);
  const status = useSelector(({ PatchSetsStore }) => PatchSetsStore.status);
  const metadata = useSelector(({ PatchSetsStore }) => PatchSetsStore.metadata);

  useEffect(
    () => () => {
      dispatch(clearPatchSetsAction());
    },
    [],
  );

  const { search } = queryParams || {};
  const searchDependency = typeof search === 'string' && search !== '' ? search : Boolean(search);

  useEffect(() => {
    dispatch(
      fetchPatchSetsAction({
        ...queryParams,
        offset: queryParams.offset + (queryParams.page - 1) * queryParams.perPage,
      }),
    );
  }, [queryParams.page, searchDependency]);

  const patchOptions = useMemo(() => {
    if (status.isLoading) {
      return [
        <SelectOption key='loading'>
          <Spinner size='md' />
        </SelectOption>,
      ];
    }

    return rows?.map((set) => (
      <SelectOption key={set.id} value={set.name} aria-label='patch-set-option'>
        {set.name}
      </SelectOption>
    ));
  }, [rows, status.isLoading]);

  const handleOpen = () => {
    setOpen(!isOpen);
  };

  const handleSelect = (_, selected) => {
    setOpen(false);
    setSelectedPatchSet(selected);

    const selectedSet = rows.filter((set) => set.name === selected);

    if (selectedSet.length === 1) {
      selectCallback(selectedSet[0]);
      formOptions?.change?.('existing_patch_set', {
        name: selectedSet[0]?.name,
        systems,
        id: selectedSet[0]?.id,
      });
    }
  };

  const changePage = (page) => {
    dispatch(changePatchSetsParams({ ...queryParams, page }));
  };

  const toggle = (toggleRef) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setOpen((open) => !open)}
      isExpanded={isOpen}
      isFullWidth
      aria-label={intl.formatMessage(messages.labelsFiltersSearchTemplatePlaceholder)}
    >
      {intl.formatMessage(messages.templateSelectExisting)}
    </MenuToggle>
  );

  return (
    <FormGroup
      fieldId='existing_patch_set'
      label={intl.formatMessage(messages.textTemplateChoose)}
      isRequired
    >
      <Select
        aria-label={intl.formatMessage(messages.labelsFiltersSearchTemplatePlaceholder)}
        onSelect={handleSelect}
        selected={selectedSets}
        onToggle={handleOpen}
        isOpen={isOpen}
        onOpenChange={setOpen}
        toggle={toggle}
        className='patch-existing-sets'
        footer={
          <SelectPagination
            changePage={changePage}
            page={queryParams.page}
            perPage={queryParams.perPage}
            totalItems={metadata.total_items}
          />
        }
      >
        <SelectList>{patchOptions}</SelectList>
      </Select>
    </FormGroup>
  );
};

SelectPagination.propTypes = {
  changePage: propTypes.func,
  page: propTypes.number,
  perPage: propTypes.number,
  totalItems: propTypes.number,
};

SelectExistingSets.propTypes = {
  setSelectedPatchSet: propTypes.func,
  selectedSets: propTypes.array,
  systems: propTypes.array,
  selectCallback: propTypes.func,
};
export default SelectExistingSets;

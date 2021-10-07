import React from 'react';
import { osFilterTypes } from '../../Utilities/constants';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const osVersionFilter = (currentFilter = {}, apply) => {

    const [isOpen, setOpen] = React.useState(false);
    const [numOptions, setNumOptions] = React.useState(10);
    const versionFromNewestToOldest = osFilterTypes.reverse();

    let { os: currentValue } = currentFilter;

    const filterByOsType = (_, value) => {
        apply({ filter: { os: value } });
    };

    const onToggle = (isOpen) => {
        setOpen(isOpen);
    };

    const onViewMoreClick = () => {
        setNumOptions(versionFromNewestToOldest.length);
    };

    return (
        {
            type: conditionalFilterType.custom,
            label: intl.formatMessage(messages.labelsFiltersOsVersion),
            value: 'custom',
            filterValues: {
                children: (
                    <Select
                        variant={versionFromNewestToOldest.length > 0 && SelectVariant.checkbox || SelectVariant.typeaheadMulti}
                        typeAheadAriaLabel={intl.formatMessage(messages.labelsFiltersOsVersionPlaceholder)}
                        onToggle={onToggle}
                        onSelect={filterByOsType}
                        selections={currentValue}
                        isOpen={isOpen}
                        aria-labelledby={'patch-os-version-filter'}
                        placeholderText={intl.formatMessage(messages.labelsFiltersOsVersionPlaceholder)}
                        {...(numOptions < versionFromNewestToOldest.length
                            && { loadingVariant: { text: 'View more', onClick: onViewMoreClick } })}
                        style={{ maxHeight: '400px', overflow: 'auto' }}
                    >
                        {versionFromNewestToOldest.slice(0, numOptions).map((option, index) => (
                            <SelectOption
                                isDisabled={option.disabled}
                                key={index}
                                value={option.value}
                                {...(option.description && { description: option.description })}
                            />
                        ))}
                    </Select>
                )
            }
        }
    );
};

export default osVersionFilter;

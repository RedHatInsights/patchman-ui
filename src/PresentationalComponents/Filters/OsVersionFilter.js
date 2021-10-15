import React from 'react';
import { osFilterTypes } from '../../Utilities/constants';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const osVersionFilter = (currentFilter = {}, apply) => {

    const [isOpen, setOpen] = React.useState(false);
    const [numOptions, setNumOptions] = React.useState(10);
    const versionFromNewestToOldest = osFilterTypes.slice().reverse();;

    let { os: currentValue } = currentFilter;
    const currentOsVersionsArray = typeof currentValue === 'string' && currentValue.split(',') || [];

    const filterByOsType = (_, value) => {
        if (currentValue && !currentValue.includes(value)) {
            apply({ filter: { os: `${currentOsVersionsArray.join(',')},${value}` } });
        }
        else if (currentValue && currentValue.includes(value)) {
            const remainingOs = currentOsVersionsArray.filter(os => os !== value);

            apply({ filter: { os: remainingOs.length > 0 && `${remainingOs.join(',')}` || undefined } });
        } else {
            apply({ filter: { os: value !== '' && value || undefined  } });
        }
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
                        variant={SelectVariant.checkbox}
                        typeAheadAriaLabel={intl.formatMessage(messages.labelsFiltersOsVersionPlaceholder)}
                        onToggle={onToggle}
                        onSelect={filterByOsType}
                        selections={currentOsVersionsArray}
                        isOpen={isOpen}
                        aria-labelledby={'patch-os-version-filter'}
                        placeholderText={intl.formatMessage(messages.labelsFiltersOsVersionPlaceholder)}
                        {...(numOptions < versionFromNewestToOldest.length
                            && { loadingVariant: { text: 'View more', onClick: onViewMoreClick } })}
                        style={{ maxHeight: '400px', overflow: 'auto' }}
                    >
                        {versionFromNewestToOldest.slice(0, numOptions).map((option, index) => (
                            <SelectOption
                                key={index}
                                value={option.value}
                            />
                        ))}
                    </Select>
                )
            }
        }
    );
};

export default osVersionFilter;

import React from 'react';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
const VersionFilter = (apply, filter, packageVersions) => {

    const [isOpen, setOpen] = React.useState(false);
    const [numOptions, setNumOptions] = React.useState(10);

    const isSet = filter && filter.installed_evra;
    const installedEvra = isSet &&
        (typeof(filter.installed_evra) === 'string' && filter.installed_evra.split(',')
        || filter.installed_evra);
    const versionList = packageVersions.data && packageVersions.data.sort().map(version => ({ value: version.evra }))
        || [{ value: 'No version is available', disabled: true }];

    const onToggle = (isOpen) => {
        setOpen(isOpen);
    };

    const onSelect = (_, selection) => {
        const config = { filter: {} };
        if (!installedEvra || (installedEvra && !installedEvra.includes(selection))) {
            const existingVersions = isSet && filter.installed_evra !== '' && filter.installed_evra.concat(',') || '';

            config.filter = { installed_evra: `${existingVersions}${selection}` };
        } else {
            const filteredOutEvras = installedEvra.length !== 1
                && installedEvra.filter(evra => !evra.includes(selection)).join(',') || undefined;

            config.filter = { installed_evra: filteredOutEvras };
        }

        apply(config);
    };

    const onViewMoreClick = () => {
        setNumOptions(versionList.length);
    };

    return (
        {
            type: conditionalFilterType.custom,
            label: 'Version',
            value: 'custom',
            filterValues: {
                children: (
                    <Select
                        variant={versionList.length > 0 && SelectVariant.checkbox || SelectVariant.typeaheadMulti}
                        typeAheadAriaLabel="Filter by package version"
                        onToggle={onToggle}
                        onSelect={onSelect}
                        selections={installedEvra}
                        isOpen={isOpen}
                        aria-labelledby={'patch-version-filter'}
                        placeholderText="Filter by package version"
                        {...(numOptions < versionList.length
                            && { loadingVariant: { text: 'View more', onClick: onViewMoreClick } })}
                        style={{ maxHeight: '400px', overflow: 'auto' }}
                    >
                        {versionList.slice(0, numOptions).map((option, index) => (
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

export default VersionFilter;

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoadModule } from '@scalprum/react-core';
import { getOperatingSystems } from '../../Utilities/api';

const useOsVersionFilter = (currentFilter = '', apply) => {
    const versions = useSelector(({ entities }) => entities?.operatingSystems);
    const versionsLoaded = useSelector(({ entities }) => entities?.operatingSystemsLoaded);

    const [operatingSystems, setOperatingSystems] = useState([]);
    const [{ toGroupSelectionValue, buildOSFilterConfig } = {}] = useLoadModule(
        {
            appName: 'inventory',
            scope: 'inventory',
            module: './OsFilterHelpers'
        }
    );

    useEffect(() => {
        if (versions === undefined || versionsLoaded === undefined) {
            /* explicitly request OS versions from API */
            getOperatingSystems().then(({ results }) => {
                setOperatingSystems((results || []).map(entry => {
                    const { name, major, minor } = entry.value;
                    const versionStringified = `${major}.${minor}`;
                    return { label: `${name} ${versionStringified}`, value: `${versionStringified}` };
                }));
            });
        }
    }, []);

    useEffect(() => {
        if (versionsLoaded === true) {
            setOperatingSystems(versions);
        }
    }, [versionsLoaded]);

    const osVersionValue = (currentFilter === '' ? [] : currentFilter.split(','))
    // patchman uses "RHEL " prefix in values; need to remove
    .map((version) => version.substring(5));

    return [
        ...(buildOSFilterConfig
            ? [
                buildOSFilterConfig(
                    {
                        id: 'rhel_version',
                        value: toGroupSelectionValue(osVersionValue),
                        onChange: (event, value) => {
                            /* `versions` must be of type string, e.g., "8.9,9.0" */
                            const versions = Object.values(value)
                            .flatMap((versions) => Object.keys(versions))
                            .map((version) => `RHEL ${version}`)
                            .toString();
                            apply({ filter: { os: versions } });
                        }
                    },
                    operatingSystems
                )
            ]
            : [])
    ];
};

export default useOsVersionFilter;

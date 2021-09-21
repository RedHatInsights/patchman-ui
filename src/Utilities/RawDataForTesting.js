// raw data for testing purposes only

export const advisoryRows = [{
    attributes: {
        advisory_type: 1,
        applicable_systems: 1,
        description: 'The microcode_ctl ',
        public_date: '2020-06-24T17:22:25Z',
        synopsis: 'microcode_ctl',
        severity: 3
    },
    id: 'RHEA-2020:2743',
    type: 'advisory'
}];

export const systemAdvisoryRows = [{
    attributes: {
        advisory_type: 3,
        description: 'Kernel-based Virtual.',
        public_date: '2020-06-30T13:38:53Z',
        severity: 3,
        synopsis: 'Important'
    },
    id: 'RHSA-2020:2774',
    type: 'advisory'
}];

export const systemRows = [{
    id: '83e97cde-74b4-4752-819d-704687bbc286',
    created: '2021-06-05T09:03:09.154453Z',
    culled_timestamp: '2021-06-20T14:03:09.096101Z',
    display_name: 'RHIQE.zjjgPCaCgT.test',
    insights_id: 'f87cff90-d61a-4f9e-92d4-cdb18f0dd5df',
    last_evaluation: '2021-06-05T09:03:10.698831Z',
    last_upload: '2021-06-07T12:34:18.186723Z',
    os_major: '',
    os_minor: '',
    os_name: '',
    packages_installed: 573,
    packages_updatable: 0,
    rhba_count: 0,
    rhea_count: 0,
    rhsa_count: 0,
    other_count: 0,
    rhsm: '',
    stale: false,
    stale_timestamp: '2021-06-06T14:03:09.096101Z',
    stale_warning_timestamp: '2021-06-13T14:03:09.096101Z',
    third_party: true
}];

export const advisoryHeader = {
    attributes: {
        advisory_type: 3,
        description: 'Kernel-based Virtual.',
        public_date: '2020-06-30T13:38:53Z',
        modified_date: '2020-06-30T13:38:53Z',
        severity: 3,
        synopsis: 'Important'
    },
    id: 'RHSA-2020:2774',
    type: 'advisory'
};

export const advisoryDetailRows = {
    data: {
        attributes: {
            cves: ['CVE-2020-11080'],
            description: 'libnghttp2.',
            fixes: null,
            modified_date: '2020-06-25T16:31:29Z',
            packages: { libnghttp2: '1.33.0-3.el8_2.1.x86_64' },
            public_date: '2020-06-25T16:31:29Z',
            references: [],
            severity: 3,
            solution: 'For details',
            synopsis: 'Important: ',
            topic: 'An update .'
        }
    },
    id: 'RHSA-2020:2755',
    type: 'advisory'
};
export const systemPackages = [{
    description: 'This package contains testing data',
    evra: '2.2.*',
    name: 'acl',
    summary: 'Access control list utilities',
    updates: null
}];

export const entityDetail = {
    loaded: true,
    activeApps: [],
    entity: {
        account: '60'
    }
};

export const cveRows = [{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29921'
    },
    id: 'CVE-2021-29921',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29922'
    },
    id: 'CVE-2021-29922',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29923'
    },
    id: 'CVE-2021-29923',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29924'
    },
    id: 'CVE-2021-29924',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29925'
    },
    id: 'CVE-2021-29925',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29926'
    },
    id: 'CVE-2021-29926',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29927'
    },
    id: 'CVE-2021-29927',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29928'
    },
    id: 'CVE-2021-29928',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29929'
    },
    id: 'CVE-2021-29929',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29930'
    },
    id: 'CVE-2021-29930',
    type: 'cve'
},
{
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29931'
    },
    id: 'CVE-2021-29931',
    type: 'cve'
},  {
    attributes: {
        cvss_score: '7.300',
        impact: 'Moderate',
        synopsis: 'CVE-2021-29932'
    },
    id: 'CVE-2021-29932',
    type: 'cve'
}];

export const readyCveRows = [
    {
        id: 'CVE-2021-29921',
        key: 'CVE-2021-29921',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29922',
        key: 'CVE-2021-29922',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29923',
        key: 'CVE-2021-29923',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29924',
        key: 'CVE-2021-29924',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29925',
        key: 'CVE-2021-29925',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29926',
        key: 'CVE-2021-29926',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            {    title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29927',
        key: 'CVE-2021-29927',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29928',
        key: 'CVE-2021-29928',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29929',
        key: 'CVE-2021-29929',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29930',
        key: 'CVE-2021-29930',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29931',
        key: 'CVE-2021-29931',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    },
    {
        id: 'CVE-2021-29932',
        key: 'CVE-2021-29932',
        cells: [{ title: '[Object] ' },
            { title: '[Object]', value: 'Moderate' },
            { title: '7.3' }
        ]
    }
];

export const packageDetailData = {
    data: {
        attributes: {
            description: 'testDescription'
        }
    }
};

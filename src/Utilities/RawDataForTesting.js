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
    attributes: {
        display_name: 'automation_host',
        last_evaluation: '2020-08-12T13:57:54.028883Z',
        last_upload: '2020-08-12T09:26:33.891907Z',
        packages_installed: 0,
        packages_updatable: 0,
        rhba_count: 213,
        rhea_count: 35,
        rhsa_count: 77,
        stale: false
    },
    id: '8ddb54f5-aeeb-49b1-8448-c29049d686c1',
    type: 'system'
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

import { sortable } from '@patternfly/react-table/dist/js';
import { createAdvisoriesIcons, createOSColumn } from '../../Utilities/Helpers';

export const patchSetDetailColumns = [
  {
    key: 'os',
    title: 'OS',
    renderFunc: (value) => createOSColumn(value),
    transforms: [sortable],
  },
  {
    key: 'installable_rhsa_count',
    title: 'Installable advisories',
    renderFunc: (_a, _b, row) =>
      createAdvisoriesIcons(
        [
          row.installable_rhea_count,
          row.installable_rhba_count,
          row.installable_rhsa_count,
          row.installable_other_count,
        ],
        'installable',
      ),
    transforms: [sortable],
  },
  {
    key: 'applicable_rhsa_count',
    title: 'Applicable advisories',
    transforms: [sortable],
    renderFunc: (_a, _b, row) =>
      createAdvisoriesIcons([
        row.applicable_rhea_count,
        row.applicable_rhba_count,
        row.applicable_rhsa_count,
        row.applicable_other_count,
      ]),
  },
];

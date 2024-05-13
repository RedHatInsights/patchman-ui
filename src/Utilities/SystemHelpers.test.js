import { createSystemsSortBy, systemsColumnsMerger } from './SystemsHelpers';

describe('createSystemsSortBy,', () => {
    it('should translate main parameters', () => {
        expect(createSystemsSortBy('abc', 'ASC', undefined)).toEqual('abc');
        expect(createSystemsSortBy('abc', 'DESC', undefined)).toEqual('-abc');
    });

    it('should translate group name parameter', () => {
        expect(createSystemsSortBy('group_name', 'ASC', undefined)).toEqual(
            'groups'
        );
        expect(createSystemsSortBy('group_name', 'DESC', undefined)).toEqual(
            '-groups'
        );
    });

    it('should translate updated parameter', () => {
        expect(createSystemsSortBy('updated', 'ASC', false)).toEqual(
            'last_upload'
        );
        expect(createSystemsSortBy('updated', 'DESC', false)).toEqual(
            '-last_upload'
        );
    });

    it('should translate updated parameter while having last upload', () => {
        expect(createSystemsSortBy('updated', 'ASC', true)).toEqual(
            'os'
        );
        expect(createSystemsSortBy('updated', 'DESC', true)).toEqual(
            '-os'
        );
    });
});

describe('systemsColumnsMerger', () => {
    const baseColumns = [
        {
            key: 'updated'
        },
        {
            key: 'display_name'
        }
    ];

    it('should merge basic columns correctly', () => {
        expect(systemsColumnsMerger(baseColumns, () => []))
        .toMatchInlineSnapshot(`
[
  {
    "key": "display_name",
    "renderFunc": [Function],
  },
  {
    "key": "last_upload",
    "sortKey": "last_upload",
  },
]
`);
    });

    it('should omit extra columns', () => {
        expect(
            systemsColumnsMerger(
                [...baseColumns, { key: 'omitted' }],
                () => []
            ).map(({ key }) => key)
        ).not.toContain('omitted');
    });

    it('should keep group column', () => {
        expect(systemsColumnsMerger([...baseColumns, { key: 'groups' }], () => [])).toMatchInlineSnapshot(`
[
  {
    "key": "display_name",
    "renderFunc": [Function],
  },
  {
    "key": "groups",
  },
  {
    "key": "last_upload",
    "sortKey": "last_upload",
  },
]
`);
    });

    it('should keep tags column', () => {
        expect(systemsColumnsMerger([...baseColumns, { key: 'tags' }], () => [])).toMatchInlineSnapshot(`
[
  {
    "key": "display_name",
    "renderFunc": [Function],
  },
  {
    "key": "tags",
  },
  {
    "key": "last_upload",
    "sortKey": "last_upload",
  },
]
`);
    });
});

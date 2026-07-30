import {
  createSystemsSortBy,
  mergeInventoryColumns,
  workloadToSystemProfile,
} from './SystemsHelpers';

describe('createSystemsSortBy,', () => {
  it('should translate main parameters', () => {
    expect(createSystemsSortBy('abc', 'ASC', undefined)).toEqual('abc');
    expect(createSystemsSortBy('abc', 'DESC', undefined)).toEqual('-abc');
  });

  it('should translate group name parameter', () => {
    expect(createSystemsSortBy('group_name', 'ASC', undefined)).toEqual('groups');
    expect(createSystemsSortBy('group_name', 'DESC', undefined)).toEqual('-groups');
  });

  it('should translate updated parameter', () => {
    expect(createSystemsSortBy('updated', 'ASC', false)).toEqual('last_upload');
    expect(createSystemsSortBy('updated', 'DESC', false)).toEqual('-last_upload');
  });

  it('should translate updated parameter while having last upload', () => {
    expect(createSystemsSortBy('updated', 'ASC', true)).toEqual('os');
    expect(createSystemsSortBy('updated', 'DESC', true)).toEqual('-os');
  });
});

describe('mergeInventoryColumns', () => {
  it('should merge basic columns correctly', () => {
    const patchColumns = [
      {
        key: 'display_name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ];

    const inventoryColumns = [
      {
        key: 'display_name',
        title: 'Display name',
      },
    ];

    expect(mergeInventoryColumns(patchColumns, inventoryColumns)).toMatchObject([
      {
        key: 'display_name',
        title: 'Display name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ]);
  });

  it('should merge modified columns correctly', () => {
    const patchColumns = [
      {
        key: 'display_name',
        title: 'Name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ];

    const inventoryColumns = [
      {
        key: 'display_name',
        title: 'Display name',
      },
    ];

    expect(mergeInventoryColumns(patchColumns, inventoryColumns)).toMatchObject([
      {
        key: 'display_name',
        title: 'Name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ]);
  });

  it('should merge renamed columns correctly', () => {
    const patchColumns = [
      {
        inventoryKey: 'display_name',
        key: 'name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ];

    const inventoryColumns = [
      {
        key: 'display_name',
        title: 'Display name',
      },
    ];

    expect(mergeInventoryColumns(patchColumns, inventoryColumns)).toMatchObject([
      {
        key: 'name',
        title: 'Display name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ]);
  });
});

describe('workloadToSystemProfile', () => {
  it('should return empty object for empty workloads', () => {
    expect(workloadToSystemProfile([])).toEqual({});
  });

  it('should map sap to sap_system', () => {
    expect(workloadToSystemProfile(['sap'])).toEqual({ sap_system: true });
  });

  it('should map ansible to ansible controller_version', () => {
    expect(workloadToSystemProfile(['ansible'])).toEqual({
      ansible: { controller_version: 'not_nil' },
    });
  });

  it('should map mssql to mssql version', () => {
    expect(workloadToSystemProfile(['mssql'])).toEqual({
      mssql: { version: 'not_nil' },
    });
  });

  it('should map crowdstrike', () => {
    expect(workloadToSystemProfile(['crowdstrike'])).toEqual({ crowdstrike: true });
  });

  it('should map ibm_db2', () => {
    expect(workloadToSystemProfile(['ibm_db2'])).toEqual({ ibm_db2: true });
  });

  it('should map intersystems', () => {
    expect(workloadToSystemProfile(['intersystems'])).toEqual({ intersystems: true });
  });

  it('should map oracle_db', () => {
    expect(workloadToSystemProfile(['oracle_db'])).toEqual({ oracle_db: true });
  });

  it('should map rhel_ai', () => {
    expect(workloadToSystemProfile(['rhel_ai'])).toEqual({ rhel_ai: true });
  });

  it('should map multiple workloads at once', () => {
    expect(workloadToSystemProfile(['sap', 'ansible', 'mssql', 'crowdstrike'])).toEqual({
      sap_system: true,
      ansible: { controller_version: 'not_nil' },
      mssql: { version: 'not_nil' },
      crowdstrike: true,
    });
  });
});

import { createSystemsSortBy, mergeInventoryColumns } from './SystemsHelpers';

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

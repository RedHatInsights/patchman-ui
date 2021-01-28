import { processDate } from '@redhat-cloud-services/frontend-components-utilities/files/cjs/helpers';
import { EmptyAdvisoryList } from '../PresentationalComponents/Snippets/EmptyStates';
import { createAdvisoriesRows, createSystemAdvisoriesRows, createSystemPackagesRows, createSystemsRows } from './DataMappers';
import { handlePatchLink } from './Helpers';
import { advisoryRows, systemAdvisoryRows, systemPackages, systemRows } from './RawDataForTesting';
import { SystemUpToDate } from '../PresentationalComponents/Snippets/SystemUpToDate';

describe('DataMappers', () => {
    it('Should create advisories rows', () => {
        const [firstRow, secondRow] = createAdvisoriesRows(advisoryRows, [], []);
        expect(firstRow.id).toEqual(advisoryRows[0].id);
        expect(firstRow.isOpen).toEqual(false);
        expect(firstRow.selected).toEqual(false);
        expect(firstRow.cells[0].title).toEqual(handlePatchLink('advisories', advisoryRows[0].id));
        expect(firstRow.cells[4].title).toEqual(processDate(advisoryRows[0].attributes.public_date));
        expect(firstRow.cells[2].title.props.type).toEqual(advisoryRows[0].attributes.applicable_systems);
        expect(firstRow.cells[3].title).toEqual(
            handlePatchLink('advisories', advisoryRows[0].id, advisoryRows[0].attributes.applicable_systems)
        );
        expect(firstRow.cells[1]).toEqual(advisoryRows[0].attributes.synopsis);
        const portalAdvisoryLink = secondRow.cells[0].title;
        expect(portalAdvisoryLink.props.row).toEqual(advisoryRows[0]);
    });

    it('Should createAdvisoriesRows handle empty row data', () => {
        const result = createAdvisoriesRows([], [], []);
        expect(result[0].heightAuto).toBeTruthy();
        expect(result[0].cells[0].props).toEqual({ colSpan: 5 });
        expect(result[0].cells[0].title.type).toEqual(EmptyAdvisoryList);
    });

    it('Should create System Advisories Rows', () => {
        const [firstRow, secondRow] = createSystemAdvisoriesRows(systemAdvisoryRows, [], []);
        expect(firstRow.id).toEqual(systemAdvisoryRows[0].id);
        expect(firstRow.isOpen).toEqual(false);
        expect(firstRow.selected).toEqual(false);
        expect(firstRow.cells[0].title).toEqual(handlePatchLink('advisories', systemAdvisoryRows[0].id));
        expect(firstRow.cells[3].title).toEqual(processDate(systemAdvisoryRows[0].attributes.public_date));
        expect(firstRow.cells[2].title.props.type).toEqual(systemAdvisoryRows[0].attributes.advisory_type);
        expect(firstRow.cells[1]).toEqual(systemAdvisoryRows[0].attributes.synopsis);
        const portalAdvisoryLink = secondRow.cells[0].title;
        expect(portalAdvisoryLink.props.row).toEqual(systemAdvisoryRows[0]);
    });

    it('Should createSystemAdvisoriesRows handle empty row data and show SystemUpToDate', () => {
        const result = createSystemAdvisoriesRows([], [], [], { filter: {} });
        expect(result[0].heightAuto).toBeTruthy();
        expect(result[0].cells[0].props).toEqual({ colSpan: 6 });
        expect(result[0].cells[0].title.type).toEqual(SystemUpToDate);
    });

    it('Should createSystemAdvisoriesRows handle empty row data and show EmptyAdvisoryList', () => {
        const result = createSystemAdvisoriesRows([], [], [], { filter: { search: 'test' } });
        expect(result[0].heightAuto).toBeTruthy();
        expect(result[0].cells[0].props).toEqual({ colSpan: 6 });
        expect(result[0].cells[0].title.type).toEqual(EmptyAdvisoryList);
    });

    it('Should create system rows', () => {
        const result = createSystemsRows(systemRows, []);
        expect(result[0].id).toEqual(systemRows[0].id);
        expect(result[0].key).toEqual(expect.stringContaining(systemRows[0].id));
        expect(result[0].applicable_advisories).toEqual([
            systemRows[0].attributes.rhea_count,
            systemRows[0].attributes.rhba_count,
            systemRows[0].attributes.rhsa_count
        ]);
        expect(result[0].selected).toEqual(false);
    });

    it('Should createSystemRows handle empty data', () => {
        const result = createSystemsRows(undefined, []);
        expect(result).toEqual([]);
    });

    it('Should createSystemRows handle undfined rhea_count, rhba_count, rhsa_count', () => {
        const testData = [{
            attributes: {
                display_name: 'automation_host',
                last_evaluation: '2020-08-12T13:57:54.028883Z',
                last_upload: '2020-08-12T09:26:33.891907Z',
                packages_installed: 0,
                packages_updatable: 0,
                stale: false
            },
            id: '8ddb54f5-aeeb-49b1-8448-c29049d686c1',
            type: 'system'
        }];

        const result = createSystemsRows(testData);
        expect(result[0].applicable_advisories).toEqual([
            0,
            0,
            0
        ]);
    });

    it('Should create package list', () => {
        const packages = createSystemPackagesRows(systemPackages);
        expect(packages).toEqual([{
            id: 'acl-2.2.*',
            key: 'acl-2.2.*',
            selected: false,
            disableCheckbox: true,
            cells: [
                { title: expect.anything() }, // FIXME!
                { title: '2.2.*' },
                { title: '2.2.*' },
                { title: expect.anything() },
                { title: 'Access control list utilities' }
            ]
        }]);

        const packagesWithCompleteData = createSystemPackagesRows([{
            ...systemPackages[0],
            updates: [{ evra: 'testEvra' }],
            updatable: true
        }]);

        expect(packagesWithCompleteData).toEqual([{
            id: 'acl-2.2.*',
            key: 'acl-2.2.*',
            selected: false,
            disableCheckbox: false,
            cells: [
                { title: expect.anything()  }, // FIXME!
                { title: '2.2.*' },
                { title: 'testEvra' },
                { title: expect.anything() },
                { title: 'Access control list utilities' }
            ]
        }]);
    });

    it('Should create empty package list', () => {
        const packages = createSystemPackagesRows([]);
        expect(packages).toEqual([{
            heightAuto: true,
            cells: [
                {
                    props: { colSpan: 7 },
                    title: expect.anything()
                }
            ]
        }]);
    });
});

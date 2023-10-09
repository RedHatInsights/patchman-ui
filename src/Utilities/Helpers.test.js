/* eslint-disable */
import { SortByDirection } from '@patternfly/react-table';
import toJson from 'enzyme-to-json';
import { publicDateOptions, remediationIdentifiers } from '../Utilities/constants';
import { addOrRemoveItemFromSet, arrayFromObj, buildFilterChips, changeListParams, convertLimitOffset,
    createAdvisoriesIcons, createSortBy, decodeQueryparams, encodeApiParams, encodeParams, encodeURLParams,
    getFilterValue, getLimitFromPageSize, getNewSelectedItems, getOffsetFromPageLimit, getRowIdByIndexExpandable,
    getSeverityById, handlePatchLink, remediationProvider, mapGlobalFilters, transformPairs, templateDateFormat } from './Helpers';

const TestHook = ({ callback }) => {
    callback();
    return null;
};

export const testHook = callback => {
    mount(<TestHook callback={callback} />);
};

describe('Helpers tests', () => {
    let header = [
        {
            key: 'a'
        },
        {
            key: 'b'
        },
        {
            key: 'c'
        },
        {
            key: 'd'
        }
    ];
    it.each`
    header      | value         | offset    | result
    ${header}   | ${['-a']}     | ${0}      | ${{ index: 0, direction: SortByDirection.desc }}
    ${header}   | ${['c']}      | ${1}      | ${{ index: 3, direction: SortByDirection.asc }}
    ${undefined}   | ${undefined}      | ${undefined}      | ${{}}
    `('createSortBy: Should create correct sort for $value and offset $offset', ({header, value, offset, result}) => {
        let ret = createSortBy(header, value, offset);
        expect(ret).toEqual(result);
    });

    it.each`
    rhea | rhba | rhsa
    ${1} | ${2} | ${3}
    ${0} | ${0} | ${0}
    ${0} | ${5} | ${3}
    ${1} | ${0} | ${3}
    ${1} | ${2} | ${0}
    `('createAdvisoriesIcons: Should match advisory icons snapshot for [$rhea, $rhba, $rhsa]', ({rhea, rhba, rhsa}) => {
        let wrapper = shallow(createAdvisoriesIcons([rhea, rhba, rhsa]));
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.each`
    severity | result
    ${123}   | ${"N/A"}
    ${0}     | ${"N/A"}
    ${1}     | ${"Low"}
    ${2}     | ${"Moderate"}
    ${3}     | ${"Important"}
    ${4}     | ${"Critical"}
    `('getSeverityById: Should match $severity to value $result', ({severity, result}) => {
        expect(getSeverityById(severity).label).toEqual(result);
    });

    it('addOrRemoveItemFromSet: Should create correct object  ', () => {
        let inputArr = [
            {
                rowId: 0,
                value: 'a'
            },
            {
                rowId: 1,
                value: 'b'
            },
            {
                rowId: 2,
                value: 'c'
            },
            {
                rowId: 3,
                value: 'd'
            },
            {
                rowId: 5,
                value: undefined
            }
        ];
        let targetObj = { '4': 'e' };
        let expected = { '0': 'a', '1': 'b', '2': 'c', '3': 'd', '4': 'e' };
        let ret = addOrRemoveItemFromSet(targetObj, inputArr);

        expect(ret).toEqual(expected);
    });

    it('convertLimitOffset: Should get correct limit and offset', () => {
        let ret = convertLimitOffset(50, 1100);
        let expected = [23, 50];

        expect(ret).toEqual(expected);
    });

    it('getRowIdByIndexExpandable: Should return correct id', () => {
        let inputArr = [
            {
                id: 0,
                value: 'a'
            },
            {
                id: 1,
                value: 'b'
            },
            {
                id: 2,
                value: 'c'
            },
            {
                id: 3,
                value: 'd'
            }
        ];
        let ret = getRowIdByIndexExpandable(inputArr, 2);
        let expected = 1;

        expect(ret).toEqual(expected);
    });

    it('handlePatchLink: Get advisory link from inventory', () => {
        delete global.window.location;
        global.window.location = {
            href: 'https://cloud.redhat.com/insights/inventory'
        };
        const host = document.baseURI;
        let advisoryName = 'ABCD';
        const expected = `${host}insights/patch/advisories/${advisoryName}`;
        let result = handlePatchLink('advisories',advisoryName);
        let {
            props: { href, children }
        } = result;
        expect(href).toEqual(expected);
        expect(children).toEqual(advisoryName);
    });

    it('handlePatchLink: Get advisory link from inventory with custom text', () => {
        delete global.window.location;
        global.window.location = {
            href: 'https://cloud.redhat.com/insights/inventory'
        };
        const host = document.baseURI;
        let advisoryName = 'ABCD';
        const expected = `${host}insights/patch/advisories/${advisoryName}`;
        let result = handlePatchLink('advisories',advisoryName, 'custom text');
        let {
            props: { href, children }
        } = result;
        expect(href).toEqual(expected);
        expect(children).toEqual('custom text');
    });

    it('handlePatchLink: Get advisory link from patch', () => {
        delete global.window.location;
        global.window.location = {
            href: 'https://cloud.redhat.com/rhel/patch'
        };
        let advisoryName = 'ABCD';
        const expected = `/advisories/${advisoryName}`;
        let result = handlePatchLink('advisories',advisoryName);
        let {
            props: { to, children }
        } = result;
        expect(to).toEqual(expected);
        expect(children).toEqual(advisoryName);
    });

    it('handlePatchLink: Get advisory link from patch', () => {
        delete global.window.location;
        global.window.location = {
            href: 'https://cloud.redhat.com/rhel/patch'
        };
        let advisoryName = 'ABCD';
        const expected = `/advisories/${advisoryName}`;
        let result = handlePatchLink('advisories',advisoryName, 'custom text');
        let {
            props: { to, children }
        } = result;
        expect(to).toEqual(expected);
        expect(children).toEqual('custom text');
    });

    it('getLimitFromPageSize: Should get correct Limit', () => {
        let limit = Math.random();
        let result = getLimitFromPageSize(limit);
        expect(result).toEqual(limit);
    });

    it('getOffsetFromPageLimit: Should get correct offset', () => {
        let page = Math.random() * 10;
        let limit = Math.random() * 10;
        let result = getOffsetFromPageLimit(page, limit);
        expect(result).toEqual(page * limit - limit);
    });

    it('arrayFromObj: Should create correct array', () => {
        let items = {a: "value1", b: false, c: "value2"}
        let expected = ["value1", "value2"]
        let result = arrayFromObj(items);
        expect(result).toEqual(expected);
    });

    it.each`
    issues         | systems            |  identifier                        | result
    ${["issue-1"]} | ${["system-1"]}    | ${remediationIdentifiers.advisory} | ${{issues: [{id: "patch-advisory:issue-1", description: "issue-1"}],systems: ["system-1"]}}
    ${"issue-1"}   | ${"system-1"}      | ${remediationIdentifiers.package}  | ${{issues: [{id: "patch-package:issue-1", description: "issue-1"}],systems: ["system-1"]}}
    ${[]}          | ${["system-1"]}    | ${remediationIdentifiers.package}  | ${false}
    `('remediationProvider: Should create correct remediation object for $issues $systems', ({issues, systems, identifier, result}) => {
        expect(remediationProvider(issues,systems, identifier)).toEqual(result);
    });

    it.each`
    category         | key                  | result
    ${"public_date"} | ${"last7"}           | ${publicDateOptions[1]}
    ${"public_date"} | ${"random value"}    | ${{apiValue: "random value"}}
    ${undefined}     | ${"last7"}           | ${{ "apiValue": "last7" }}
    `('getFilterValue: Should create object for $category', ({category, key, result}) => {
        expect(getFilterValue(category,key)).toEqual(result);
    });

    it.each`
    parameters                                         | shouldTranslate   | result
    ${{search: "trolo"}}                               | ${true}           | ${"?search=trolo"}
    ${{search: ""}}                                    | ${true}           | ${"?"}
    ${{filter: {advisory_type: 2}}}                    | ${false}          | ${"?filter%5Badvisory_type%5D=2"}
    ${{filter: {advisory_type: [1,2]}}}                | ${true}           | ${"?filter%5Badvisory_type%5D=in%3A1%2C2"}
    ${{filter: {advisory_type: [1,2]}, param: "text"}} | ${true}           | ${"?param=text&filter%5Badvisory_type%5D=in%3A1%2C2"}
    `('encodeParams: Should encode parameters $parameters', ({parameters, shouldTranslate, result}) => {
        expect(encodeParams(parameters,shouldTranslate)).toEqual(result);
    });

    it.each`
    parameters                                              | result
    ${"search=trolo"}                                       | ${{search: "trolo"}}
    ${"filter%5Badvisory_type%5D=2"}                        | ${{filter: {advisory_type: 2}}}
    ${"param=text&filter%5Badvisory_type%5D=in%3A1%2C2"}    | ${{filter: {advisory_type: ["1","2"]}, param: "text"}}
    `('decodeQueryparams: Should decodeQueryParams $parameters', ({parameters, result}) => {
        expect(decodeQueryparams(parameters)).toEqual(result);
    });

    it.each`
    filters               | search       | result
    ${{advisory_type_name: 'bugfix'}} | ${undefined} | ${[{"category": "Advisory type", "chips": [{"id": 'bugfix', "name": "Bugfix", "value": 'bugfix'}], "id": "advisory_type_name"}]}
    ${undefined}          | ${"firefox"} | ${[{"category": "Search", "chips": [{"name": "firefox", "value": "firefox"}], "id": "search"}]}
     `('buildFilterChips: Should build correct filter chip, $filters, $search ', ({filters, search, result}) => {
        expect(buildFilterChips(filters, search)).toEqual(result);
    });

    it.each`
    oldParams               | newParams       | result
    ${{param: "Hey!"}}      | ${{param: "Yo!"}} | ${{param: "Yo!"}}
    ${{offset: 15}} | ${{limit:100}} | ${{"limit": 100, "offset": 0}}
    ${{filter: {advisory_type: 2}}} | ${{filter: {public_date: "last7" }}} | ${{filter:{advisory_type: 2, public_date: "last7"}, offset: 0}}
     `('changeListParams: Should return correct parameters', ({oldParams, newParams, result}) => {
        expect(changeListParams(oldParams, newParams)).toEqual(result);
    });

    it.each`
    parameters                | result
    ${{filter: {advisory_type: 2}}}  | ${"?filter%5Badvisory_type%5D=2"}
    ${{filter: {advisory_type: 1}, id: 15}}  | ${"?filter%5Badvisory_type%5D=1"}
     `('encodeURLParams: Should return correct string for $parameters', ({parameters, result}) => {
        expect(encodeURLParams(parameters)).toEqual(result);
    });

    it.each`
    parameters                | result
    ${{filter: {advisory_type: 2}}}  | ${"?filter%5Badvisory_type%5D=2"}
    ${{filter: {advisory_type: 1}, id: 15}}  | ${"?id=15&filter%5Badvisory_type%5D=1"}
     `('encodeApiParams: Should return correct string for $parameters', ({parameters, result}) => {
        expect(encodeApiParams(parameters)).toEqual(result);
    });

    it.each`
    selectedItems                   | currentItems                  | result
    ${{ id: "a", selected: true}}   | ${{c: true, d: false}}        | ${{"a": true, "c": true}}
    ${{ id: "a", selected: true }}  | ${{ c: undefined, d: true }}  | ${{ "a": true, "d": true }}
    ${{ id: "a", selected: true }}  | ${{ c: '', d: true }}         | ${{ "a": true, "d": true }}
     `('getNewSelectedItems: Should return new set of selected items', ({selectedItems, currentItems,result}) => {
        expect(getNewSelectedItems(selectedItems, currentItems)).toEqual(result);
    });

    it('Should return "false" when there is no issues available', () => {
        const resultWhenParams = transformPairs({ data: {} });
        expect(resultWhenParams).toEqual({ "issues": [] });

        const resultWhenNoParams = transformPairs();
        expect(resultWhenNoParams).toEqual({ "issues": [] });
    });
    it('Should return transformed issues', () => {
        const resultWhenParams = transformPairs({ data: { testAdvisory1: ['test-system-1'], testAdvisory2: ['test-system-2'] } }, 'test-identifier');
        expect(resultWhenParams).toEqual({
            issues: [
                { description: 'testAdvisory1', id: 'test-identifier:testAdvisory1', systems: ['test-system-1'] },
                { description: 'testAdvisory2', id: 'test-identifier:testAdvisory2', systems: ['test-system-2'] }
            ]
        });
    });

    test("templateDateFormat function should correctly parse dates", () => {
        expect(templateDateFormat("2023-03-05")).toEqual("05 Mar 2023");
        expect(templateDateFormat("2023-03-22T20:00:00-04:00")).toEqual("23 Mar 2023");
        expect(templateDateFormat("2023-03-22T20:00:00-00:00")).toEqual("22 Mar 2023");
        expect(templateDateFormat("2023-03-22T20:00:00+04:00")).toEqual("22 Mar 2023");
        expect(templateDateFormat("2023-03-22T20:00:00Z")).toEqual("22 Mar 2023");
    });
});

describe('Test global filters', () => {

    it.each`
    tags                               | SIDs               | workloads                                                                 | result
    ${[]}                              | ${[]}              | ${{ 'Ansible Automation Platform': { isSelected: true } }}                | ${{ selectedTags: [], systemProfile: { ansible: { controller_version: 'not_nil' } } }}
    ${[]}                              | ${[]}              | ${{ 'Microsoft SQL': { isSelected: true } }}                              | ${{ selectedTags: [], systemProfile: { mssql: { version: 'not_nil' } }  }}
    ${[]}                              | ${[]}              | ${{ SAP: { isSelected: true } }}                                          | ${{ selectedTags: [], systemProfile: { sap_system: true } }}
    ${[]}                              | ${['abc']}         | ${{ SAP: { isSelected: true } }}                                          | ${{ selectedTags: [], systemProfile: { sap_sids: ['abc'], sap_system: true } }}
    ${[]}                              | ${['abc', 'bca']}  | ${{ SAP: { isSelected: true }, 'Microsoft SQL': { isSelected: true } }}   | ${{ selectedTags: [], systemProfile: { sap_sids: ['abc', 'bca'], sap_system: true, mssql: { version: 'not_nil' } } }}
    ${['null/key.BnZPeP=tag.MNGmxQ']}  | ${['abc', 'bca']}  | ${{ SAP: { isSelected: true } }}                                              | ${{ selectedTags: ["tags=null%2Fkey.BnZPeP%3Dtag.MNGmxQ"], systemProfile: { sap_sids: ['abc', 'bca'], sap_system: true } }}
     `('mapGlobalFilters: Should build correct global filters, $tags, $SIDs, $workloads ', ({ tags, SIDs, workloads, result }) => {
         expect(mapGlobalFilters(tags, SIDs, workloads,)).toEqual(result);
    });
})
/* eslint-enable */

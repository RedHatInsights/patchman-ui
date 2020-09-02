import TableView from './TableView';
import toJson from 'enzyme-to-json';
/* eslint-disable */
const testObj = {
    columns: [],
    store: {
        rows: [],
        metadata: {},
        status: false,
        queryParams: {}
    },
    onCollapse: jest.fn(),
    onSelect: jest.fn(),
    onSetPage: jest.fn(),
    onPerPageSelect: jest.fn(),
    onSort: jest.fn(),
    onExport: jest.fn(),
    filterConfig: {
        items: [{
            label: 'First filter'
        }, {
            label: 'Second filter',
            type: 'checkbox',
            filterValues: {
                items: [{ label: 'Some checkbox' }]
            }
        }]
    },
    sortBy: {},
    remediationProvider: jest.fn(),
    selectedRows: {},
    apply: jest.fn()
};

describe('TableView', () => {
    it('TableView', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('test table props', () => {
        const wrapper = shallow(<TableView {...testObj}  store = {{
            rows: [],
            metadata: { total_items: 10 },
            status: 'resolved',
            queryParams: {}
        }} />);

        it('TableView', () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('Should call onCollapse', () => {    
            const { cells }  = wrapper.find('Table').props();
            wrapper.find('Table').props().onSelect();
            expect(testObj.onSelect).toHaveBeenCalled();
            expect(cells).toEqual([]);
        });

    })



    it('TableView', () => {
        const wrapper = shallow(<TableView {...testObj}  store = {{
            rows: [],
            metadata: {},
            status: 'loading',
            queryParams: {}
        }} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    
    it('Should open remediation modal', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { actionsConfig: { actions }}  = wrapper.find('PrimaryToolbar').props();
        const remediation = actions[0].props.children;
        remediation[0].props.onClick();
        wrapper.update();
        expect(remediation[1]).toBeTruthy();
    });

    it('Should unselect', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { items }}  = wrapper.find('PrimaryToolbar').props();
        items[0].onClick();
        expect(testObj.onSelect).toHaveBeenCalledWith('none');
    });

    it('Should select page', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { items }}  = wrapper.find('PrimaryToolbar').props();
        items[1].onClick();
        expect(testObj.onSelect).toHaveBeenCalledWith('page');
    });

    it('Should select all', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { items }}  = wrapper.find('PrimaryToolbar').props();
        items[2].onClick();
        expect(testObj.onSelect).toHaveBeenCalledWith('all');
    });

    it('Should unselect all ', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { onSelect }}  = wrapper.find('PrimaryToolbar').props();
        onSelect(false);
        expect(testObj.onSelect).toHaveBeenCalledWith('none');
    });
});
/* eslint-enable */

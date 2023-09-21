import TableView from './TableView';
import NoRegisteredSystems from '../../PresentationalComponents/Snippets/NoRegisteredSystems';
import ShallowRenderer from 'react-test-renderer/shallow';

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

const renderer = new ShallowRenderer();

describe('TableView', () => {
    it('TableView', () => {
        renderer.render(
            <TableView {...testObj} />
        );
        const result = renderer.getRenderOutput();
        expect(result).toMatchSnapshot();
    });

    describe('test table props', () => {
        const wrapper = shallow(<TableView {...testObj}  store = {{
            rows: [],
            metadata: { total_items: 10 },
            status: 'resolved',
            queryParams: {}
        }} />);

        it('TableView', () => {
            renderer.render(
                <TableView {...testObj}  store = {{
                    rows: [],
                    metadata: { total_items: 10 },
                    status: 'resolved',
                    queryParams: {}
                }} />
            );
            const result = renderer.getRenderOutput();
            expect(result).toMatchSnapshot();
        });

        it('Should call onCollapse', () => {
            const { cells }  = wrapper.find('Table').props();
            wrapper.find('Table').props().onSelect();
            expect(testObj.onSelect).toHaveBeenCalled();
            expect(cells).toEqual([]);
        });

    });

    it('TableView', () => {
        renderer.render(
            <TableView {...testObj}  store = {{
                rows: [],
                metadata: {},
                status: 'loading',
                queryParams: {}
            }} />
        );
        const result = renderer.getRenderOutput();
        expect(result).toMatchSnapshot();
    });

    it('Should open remediation modal', () => {
        renderer.render(
            <TableView {...testObj} />
        );
        const result = renderer.getRenderOutput();
        expect(result).toMatchSnapshot();
    });

    it('Should unselect', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { items } }  = wrapper.find('PrimaryToolbar').props();
        items[0].onClick();
        expect(testObj.onSelect).toHaveBeenCalledWith('none');
    });

    it('Should select page', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { items } }  = wrapper.find('PrimaryToolbar').props();
        items[1].onClick();
        expect(testObj.onSelect).toHaveBeenCalledWith('page');
    });

    it('Should select all', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { items } }  = wrapper.find('PrimaryToolbar').props();
        items[2].onClick();
        expect(testObj.onSelect).toHaveBeenCalledWith('all', null, null, expect.any(Function));
    });

    it('Should unselect all ', () => {
        const wrapper = shallow(<TableView {...testObj} />);
        const { bulkSelect: { onSelect } }  = wrapper.find('PrimaryToolbar').props();
        onSelect(false);
        expect(testObj.onSelect).toHaveBeenCalledWith('none');
    });

    it('Should display NoRegisteredSystems when there are no registered systems', () => {
        const wrapper = shallow(<TableView {...testObj} store={{
            rows: [],
            metadata: { total_items: 10, has_systems: false },
            status: 'resolved',
            queryParams: {}
        }} />);

        expect(wrapper.find(NoRegisteredSystems)).toBeTruthy();
    });
});


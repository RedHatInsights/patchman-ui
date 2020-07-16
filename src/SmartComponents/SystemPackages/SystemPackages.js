import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { systemPackagesColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { fetchApplicableSystemPackages, selectSystemPackagesRow } from '../../store/Actions/Actions';
import { fetchApplicablePackagesApi } from '../../Utilities/api';
import { createSystemPackagesRows } from '../../Utilities/DataMappers';

const SystemPackages = () => {
    const dispatch = useDispatch();
    const entity = useSelector(({ entityDetails }) => entityDetails.entity);
    const packages = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.rows
    );
    const queryParams = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.queryParams
    );
    const selectedRows = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.selectedRows
    );
    /*
    const metadata = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.metadata
    );*/
    const status = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.status
    );/*
    const error = useSelector(
        ({ SystemPackageListStore }) => SystemPackageListStore.error
    );*/
    const rows = React.useMemo(
        () =>
            createSystemPackagesRows(packages, selectedRows),
        [packages,  selectedRows]
    );

    React.useEffect(()=> {
        dispatch(fetchApplicableSystemPackages({ id: entity.id }));
    }, []);

    const onSelect = React.useCallback((event, selected, rowId) => {
        const toSelect = [];
        switch (event) {
            case 'none': {
                Object.keys(selectedRows).forEach(id=>{
                    toSelect.push(
                        {
                            id,
                            selected: false
                        }
                    );
                });
                dispatch(
                    selectSystemPackagesRow(toSelect)
                );
                break;
            }

            case 'page': {
                packages.forEach(({ id })=>{
                    toSelect.push(
                        {
                            id,
                            selected: true
                        }
                    );});
                dispatch(
                    selectSystemPackagesRow(toSelect)
                );
                break;
            }

            case 'all': {
                const fetchCallback = (res) => {
                    Object.keys(res).forEach((pkg)=>{
                        toSelect.push(
                            {
                                id: pkg,
                                selected: true
                            }
                        );});
                    dispatch(
                        selectSystemPackagesRow(toSelect)
                    );
                };

                fetchApplicablePackagesApi({ id: entity.id, limit: 999999 }).then(fetchCallback);

                break;
            }

            default: {
                toSelect.push({
                    id: Object.keys(packages)[rowId],
                    selected
                });
                dispatch(
                    selectSystemPackagesRow(toSelect)
                );
            }}

    }
    );

    return (
        <React.Fragment>
            <TableView
                columns={systemPackagesColumns}
                store={{ rows, metadata: { total_items: 15 }, status, queryParams }}
                onSelect={onSelect}
                selectedRows={selectedRows}
            />
        </React.Fragment>
    );
};

export default SystemPackages;

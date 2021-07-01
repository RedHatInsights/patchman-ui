import {
    cellWidth,


    expandable, sortable,

    SortByDirection, Table as PfTable,
    TableBody,

    TableGridBreakpoint, TableHeader,


    TableVariant
} from '@patternfly/react-table';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

function getLoader() {
    return (
        (insights.experimental && insights.experimental.loadRemediations) ||
        insights.loadRemediations
    );
}

const RemediationModal = ({ data }) => {
    const dispatch = useDispatch();
    const [remediations, setRemediations] = React.useState(false);
    console.log(data);
    React.useEffect(() => {
        getLoader()({
            pfReactTable: {
                Table: PfTable,
                TableBody,
                TableHeader,
                TableGridBreakpoint,
                cellWidth,
                TableVariant,
                sortable,
                expandable,
                SortByDirection
            }
        }).then(remediations => setRemediations(remediations));
        return () => setRemediations(false);
    }, []);

    const handleRemediationSuccess = res => {
        dispatch(addNotification(res.getNotification()));
    };

    React.useEffect(() => {
        remediations &&
            remediations
            .openWizard({ ...data, onRemediationCreated: handleRemediationSuccess });
    }, [remediations]);

    return (
        <React.Fragment>
            {remediations.RemediationWizard && (
                <remediations.RemediationWizard />
            )}
        </React.Fragment>
    );
};

RemediationModal.propTypes = {
    data: propTypes.object
};

RemediationModal.defaultProps = {
    onRemediationCreated: f => f
};

export default RemediationModal;

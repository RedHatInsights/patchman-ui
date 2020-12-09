import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint,
    cellWidth,
    TableVariant,
    sortable,
    expandable,
    SortByDirection
} from '@patternfly/react-table';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
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
            .openWizard(data)
            .then(result => result && handleRemediationSuccess(result));
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

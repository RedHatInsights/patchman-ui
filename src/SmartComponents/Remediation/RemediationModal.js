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
        //temporary fix: this code decides if there is already mounted remediation modal
        const remediationModal = document.getElementsByClassName('ins-c-remediation-modal');
        if (remediations && remediationModal.length === 0) {
            remediations
            .openWizard({ ...data, onRemediationCreated: handleRemediationSuccess });
        }
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

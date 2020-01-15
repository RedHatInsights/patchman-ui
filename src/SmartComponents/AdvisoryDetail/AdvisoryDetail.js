import { Grid, GridItem } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from '../../PresentationalComponents/Header/Header';
import { paths } from '../../Routes';
import { fetchAvisoryDetails } from '../../store/Actions/Actions';

const AdvisoryDetail = ({ match }) => {
    const dispatch = useDispatch();
    const [advisoryName] = React.useState(match.params.advisoryId);
    const advisoryDetails = useSelector(
        ({ AdvisoryDetailStore }) => AdvisoryDetailStore
    );
    React.useEffect(() => {
        dispatch(fetchAvisoryDetails({ advisoryName }));
    }, []);
    return (
        <React.Fragment>
            <Header
                title={advisoryName}
                breadcrumbs={[
                    {
                        title: 'System Patching',
                        to: paths.advisories.to,
                        isActive: false
                    },
                    {
                        title: advisoryName,
                        isActive: true
                    }
                ]}
            >
                <Grid gutter="sm">
                    <GridItem md={8} sm={12}>
                        {advisoryDetails.isLoading === false &&
                            advisoryDetails.data.attributes.description}
                    </GridItem>
                </Grid>
            </Header>
        </React.Fragment>
    );
};

AdvisoryDetail.propTypes = {
    match: propTypes.any
};

export default withRouter(AdvisoryDetail);

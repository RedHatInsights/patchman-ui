/* eslint-disable react/prop-types */
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { Spinner } from '@redhat-cloud-services/frontend-components/components/Spinner';
import propTypes from 'prop-types';
import React from 'react';

export const WithLoaderVariants = {
    spinner: 'spinner',
    skeleton: 'skeleton'
};

const loaderMap = {
    [WithLoaderVariants.skeleton]: ({ size, isDark }) => (
        <Skeleton size={size} isDark={isDark} />
    ),
    [WithLoaderVariants.spinner]: ({ centered }) => (
        <Spinner centered={centered} />
    )
};

export const WithLoader = ({ loading, variant, children, ...props }) => {
    if (loading !== false) {
        return loaderMap[variant](props);
    }

    return children;
};

WithLoader.propTypes = {
    loading: propTypes.bool,
    variant: propTypes.string,
    children: propTypes.any
};

export default WithLoader;

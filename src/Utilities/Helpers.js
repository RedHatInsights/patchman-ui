import { useDispatch } from 'react-redux';
import React from 'react';

export const useMountDispatch = actionCreator => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actionCreator());
    }, []);
};

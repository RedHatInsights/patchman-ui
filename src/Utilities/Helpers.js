import React from 'react';
import { useDispatch } from 'react-redux';

export const useMountDispatch = actionCreator => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actionCreator());
    }, []);
};

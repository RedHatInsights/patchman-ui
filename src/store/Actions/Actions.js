import * as ActionTypes from '../ActionTypes';
import React from 'react';

export const fetchApplicableAdvisories = () => ({
    type: ActionTypes.FETCH_APPLICABLE_ADVISORIES,
    payload: new Promise(resolve => {
        resolve([
            {
                cells: [
                    {
                        title: <div>Name</div>,
                        props: {
                            title: 'hover title',
                            colSpan: 3
                        }
                    },
                    '4',
                    'Some synopsis'
                ]
            }
        ]);
    }).then(result => result)
});

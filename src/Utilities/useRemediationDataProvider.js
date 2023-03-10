import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import {
    removeUndefinedObjectKeys
} from './Helpers';

const initializeWorker = () => {
    const worker = new Worker(new URL('./RemediationPairs.js', import.meta.url));
    return [worker, () => worker.terminate()];
};

const deligateWorkerTask = (worker, task) => {
    worker.postMessage(task);

    //waits web worker response
    return new Promise((resolve, reject) => {
        worker.onmessage = ({ data: { status, error, result } } = {}) => {
            if (status === 'resolved')  {
                resolve(result);
            }

            reject(error);
        };
    });
};

export const prepareRemediationPairs = async (task, dispatch) => {
    const [worker, terminateWorker] = initializeWorker();
    const deligatedTask = deligateWorkerTask(worker, task);

    const response = await deligatedTask.catch(err =>
        dispatch(
            addNotification(
                {
                    title: `There was an error while processing.`,
                    description: err,
                    variant: 'danger'
                }
            )
        ));

    terminateWorker();

    //displays NoDataModal when there is no patch updates available
    return response?.issues?.length ? response : false;
};

/**
* Provides remediation data, systems with all of their corresponding issues.
* @param {Function} [setRemediationLoading] function to toggle remediation loading state
* @param {Array} [selectedRows] array of systems to calculate
* @returns {handleSystemsRemoval}
*/
const useRemediationDataProvider = (selectedRows, setRemediationLoading, remediationType, areAllSelected) => {
    const dispatch = useDispatch();
    const remediationDataProvider = async () => {
        setRemediationLoading(true);

        //Auth token must be added to webworker request as webworker does not have access
        //to default token by platform
        const authToken = await window.insights.chrome.auth.getToken();
        const remediationPairs = await prepareRemediationPairs(
            {
                payload: removeUndefinedObjectKeys(selectedRows),
                remediationType,
                areAllSelected,
                authToken
            },
            dispatch
        );

        setRemediationLoading(false);

        return remediationPairs;
    };

    return remediationDataProvider;
};

export default useRemediationDataProvider;

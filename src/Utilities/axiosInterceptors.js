import {
    authInterceptor,
    responseDataInterceptor
} from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import axios from 'axios';
import { ReadOnlyNotification } from './constants';
const axiosInstance = axios.create();

export function errorInterceptor(err) {

    if (!axios.isCancel(err)) {

        const { response, isAxiosError } = { ...err };

        if (response && isAxiosError) {
            const { status, statusText, data } = response;

            if (!status) {
                throw err;
            } else {
                const genericError = {
                    title:
                            'There was an error getting data'
                };

                const result = { ...genericError, detail: data.error && data.error || statusText, status };

                throw result;
            }
        }

        throw err;
    }
}

export function readOnlyInterceptor(error) {
    if (error.response && error.response.status === 503) {
        const data = ReadOnlyNotification;
        throw data;
    }

    throw error;
}

axiosInstance.interceptors.request.use(authInterceptor);
axiosInstance.interceptors.response.use(responseDataInterceptor);
axiosInstance.interceptors.response.use(null, readOnlyInterceptor);
axiosInstance.interceptors.response.use(null, errorInterceptor);

export default axiosInstance;

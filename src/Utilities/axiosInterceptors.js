import { authInterceptor } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import axios from 'axios';
import { ReadOnlyNotification } from './constants';

const axiosInstance = axios.create();

export function errorInterceptor(err) {
  if (!axios.isCancel(err)) {
    const { response } = { ...err };

    if (response && err.isAxiosError) {
      const { status, statusText, data } = response;

      if (!status) {
        return err;
      } else {
        const genericError = {
          title: 'There was an error getting data',
        };

        const result = { ...genericError, detail: data.error || statusText, status };

        throw result;
      }
    }

    return err;
  }

  return err;
}

export function readOnlyInterceptor(error) {
  if (error.response && error.response.status === 503) {
    const data = ReadOnlyNotification;
    throw data;
  }

  throw error;
}

export function responseDataInterceptor(response) {
  if (response.data && typeof response.data === 'object') {
    return { ...response.data, status: response.status };
  }

  return response;
}

axiosInstance.interceptors.request.use(authInterceptor);
axiosInstance.interceptors.response.use(responseDataInterceptor);
axiosInstance.interceptors.response.use(null, readOnlyInterceptor);
axiosInstance.interceptors.response.use(null, errorInterceptor);

export default axiosInstance;

import axios from 'axios';
import { baseUrl } from './helper/baseUrl.helper';
import { fetchDataType } from './types/auth.types';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';

let intiHeaders: {
  'Content-Type'?: string;
  'Cache-Control'?: string;
  Authorization?: string;
} = {
  'Content-Type': 'application/json',
  'Cache-Control':
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
};

export default async function fetchData({
  method,
  url,
  data,
  typeBaseUrl,
  headers,
  auth,
}: fetchDataType): Promise<any> {
  try {
    const base_url = baseUrl(typeBaseUrl);
    intiHeaders = {
      ...intiHeaders,
      ...(headers && headers),
      ...(auth && {
        Authorization: `Bearer ${auth}`,
      }),
    };
    const instance = axios.create({
      baseURL: base_url,
      headers: intiHeaders,
      withCredentials: true,
    });
    const response = await instance({
      method,
      url: `${url}`,
      ...(data && { data }),
    });
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        isValid: true,
        data: response?.data || {},
      };
    }
    return {
      isValid: false,
      status: response.status,
    };
  } catch (e: any) {
    Logger.error(e.message);
    return {
      isValid: false,
      status: e.message,
    };
  }
}

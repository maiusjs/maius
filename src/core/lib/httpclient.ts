import Axios, { AxiosStatic } from 'axios';

export type HttpClient = AxiosStatic;

export const httpClient: HttpClient = Axios;

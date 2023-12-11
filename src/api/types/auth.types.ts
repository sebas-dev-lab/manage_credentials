export type fetchDataType = {
  method: string;
  url: string;
  data?: any;
  headers?: { [key: string]: any };
  auth?: string;
  typeBaseUrl: string;
};

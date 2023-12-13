import fetchData from './fetch.api';

type typeRandom = '';

export class ApiService {
  // ======================== Prueba ====================== //
  static api_x = async (data: typeRandom): Promise<{}> =>
    fetchData({
      method: 'GET',
      url: ``,
      data: data,
      typeBaseUrl: '',
    });
}

import http from 'ky';

export const getList = async () => {
  const { code, data } = await http.get('http://106.12.149.147:3333/list').json();
  return code === 0 ? [data, null] : [null, { code }];
};

export const getDetail = async (name) => {
  const { code, data } = await http.get(`http://106.12.149.147:3333/detail/${name}`).json();
  return code === 0 ? [data, null] : [null, { code }];
  // console.log('name', name);
  // return [
  //   {
  //     name: 'eo-module-eagle',
  //     version: '1.0.0',
  //     author: 'Eolink',
  //     main: 'dist/index.js',
  //     description: 'A eo-module-eagle module of EOAPI-Core.',
  //   },
  //   null,
  // ];
};

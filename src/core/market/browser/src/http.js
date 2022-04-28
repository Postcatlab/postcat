import http from 'ky';

export const getList = async () => {
  const { code, data } = await http.get('http://106.12.149.147:3333/list').json();
  return code === 0 ? [data, null] : [null, { code }];
};

export const getDetail = async (name) => {
  const { code, data } = await http.get(`http://106.12.149.147:3333/detail/${name}`).json();
  return code === 0 ? [data, null] : [null, { code }];
};

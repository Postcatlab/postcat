// 接口文档：https://eolinker.w.eolink.com/old/home/api_studio/inside/api/list?groupID=-1&projectHashKey=Dr31QyT4b832495fe945fb9420215f167e33b2dc1fb4f27&spaceKey=eolinker
export const setupTests = async () => {
  await import('./project.test');
  await import('./apiData.test');
  await import('./apiGroup.test');
  await import('./environment.test');
};

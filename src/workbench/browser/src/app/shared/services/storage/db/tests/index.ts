export const setupTest = async () => {
  await import('./project.test');
  await import('./apiData.test');
  await import('./apiGroup.test');
  await import('./environment.test');
};

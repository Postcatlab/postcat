export const getRest: (url: string) => string[] = (url) => {
  return [...url.replace(/{{(.*?)}}/g, '').matchAll(/{(.*?)}/g)].map((val) => val[1]);
};

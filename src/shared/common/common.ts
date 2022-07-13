export const isNotEmpty = (value: any) => {
  switch (typeof value) {
    case 'undefined':
      return false;
    case 'string':
      return value.length !== 0;
    case 'object':
      if (Array.isArray(value)) {
        return value.length !== 0;
      } else if (value === null) {
        return false;
      } else {
        return Object.keys(value).length !== 0;
      }
    default:
      return true;
  }
};


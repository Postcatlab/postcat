import _ from 'lodash';

export const rulesHash = {
  email: {
    isBuiltIn: true,
    statementRule: () => `Validators.email`,
    errTip: ({ params: target }) => `Min length is ${target};`,
    dynamicRule: () => ``,
  },
  minlength: {
    isBuiltIn: true,
    statementRule: ({ params }) => `Validators.minLength(${params})`,
    errTip: ({ params: target }) => `Min length is ${target};`,
    dynamicRule: ({ params: target, valid }) => `
        if (control.value.length < ${target}) {
          return { ${valid}: true, error: true };
        }
      `,
  },
  maxlength: {
    isBuiltIn: true,
    statementRule: ({ params }) => `Validators.maxLength(${params})`,
    errTip: ({ params: target }) => `Max length is ${target};`,
    dynamicRule: ({ params: target, valid }) => `
        if (control.value.length > ${target}) {
          return { ${valid}: true, error: true };
        }
      `,
  },
  required: {
    isBuiltIn: true,
    statementRule: () => `Validators.required`,
    errTip: ({ label }) => `Please input your ${label.split('/').map(_.lowerCase).join(' or ')};`,
    dynamicRule: ({ valid }) => `
        if(!control.value) {
          return { ${valid}: true, error: true }
        }
      `,
  },
  isEqual: {
    isBuiltIn: false,
    statementRule: ({ id }) => `this.isEqual${id}Validator`,
    errTip: () => `Please confirm your password;`,
    dynamicRule: ({ form, params: target, valid }) => `
        if (control.value && control.value !== this.${form}.controls.${target}.value) {
          return { ${valid}: true, error: true };
        }`,
  },
};

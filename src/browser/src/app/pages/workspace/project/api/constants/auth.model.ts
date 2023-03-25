export const NONE_AUTH_OPTION = {
  name: 'none',
  label: $localize`No Auth`
};

export const INHERIT_AUTH_OPTION = {
  name: 'inherited',
  label: $localize`Inherit auth from parent`
};

export type AuthInfo = {
  authType: string;
  isInherited?: isInherited;
  authInfo: Record<string, any>;
};
export enum isInherited {
  inherit = 1,
  notInherit = 0
}

export type AuthIn = 'group' | 'api-test' | 'api-test-history';

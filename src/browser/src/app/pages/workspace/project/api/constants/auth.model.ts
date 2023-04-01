/**
 * Auth Type
 */
export enum AuthTypeValue {
  Inherited = 'inherited',
  None = 'none'
  //Other auth exetnsion id
}
export const NONE_AUTH_OPTION = {
  name: AuthTypeValue.None,
  label: $localize`No Auth`
};

export const INHERIT_AUTH_OPTION = {
  name: AuthTypeValue.Inherited,
  label: $localize`Inherit auth from parent`
};

export type AuthInfo = {
  authType: AuthTypeValue | string;
  isInherited?: isInherited;
  authInfo: Record<string, any>;
};
export enum isInherited {
  inherit = 1,
  notInherit = 0
}

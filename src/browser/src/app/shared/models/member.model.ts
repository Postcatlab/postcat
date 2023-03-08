export const ROLE_TITLE_BY_ID = {
  'Project Owner': $localize`Project Owner`,
  'Project Editor': $localize`Project Editor`,
  'Workspace Owner': $localize`Workspace Owner`,
  'Workspace Editor': $localize`Workspace Editor`
};
export interface Role {
  /**
   * Role belongs module
   * 1: workspace, 2: project
   */
  module: 1 | 2;
  name: string;
  /**
   * Workspace Owner/Project Owner
   */
  uuid: string;
}

declare namespace API {
  /**
   * LoginToken
   */
  type LoginToken = {
    /**
     * JWT身份Token
     */
    accessToken: string;
    accessTokenExpiresAt: number;
    /**
     * Refresh Token
     */
    refreshToken: string;
    refreshTokenExpiresAt: number;
  };

  /**
   * LoginInfoDto
   */
  type LoginInfoDto = {
    /**
     * 管理员密码
     */
    password: string;
    /**
     * 管理员用户名
     */
    username: string;
  };

  /**
   * JwtRefreshTokenDto
   */
  type JwtRefreshTokenDto = {
    refreshToken: string;
  };

  /**
   * WorkspaceEntity
   */
  export interface Workspace {
    /**
     * 空间创建者ID
     */
    creatorID: number;
    id: number;
    /**
     * 空间名称
     */
    title: string;
    users: User[];
  }

  /**
   * UserEntity
   */
  export interface User {
    /**
     * 用户头像
     */
    avatar?: string;
    id: number;
    /**
     * 密码
     */
    password: string;
    /**
     * 用户名
     */
    username: string;
    workspaces: Workspace[];
  }

  /**
   * UpdateUserInfoDto
   */
  export type UpdateUserInfoDto = {
    /**
     * 头像
     */
    avatar?: string;
    /**
     * 用户名
     */
    username?: string;
  };

  /**
   * UpdateUserPasswordDto
   */
  export type UpdateUserPasswordDto = {
    /**
     * 新密码
     */
    newPassword?: string;
    /**
     * 旧密码
     */
    oldPassword?: string;
  };

  /**
   * UserEntity
   */
  export interface UserEntity {
    /**
     * 用户头像
     */
    avatar?: string;
    id: number;
    /**
     * 密码
     */
    password: string;
    /**
     * 用户名
     */
    username: string;
    workspaces: ApifoxModal[];
  }

  /**
   * WorkspaceEntity
   */
  export interface ApifoxModal {
    /**
     * 空间创建者ID
     */
    creatorID: number;
    id: number;
    /**
     * 空间名称
     */
    title: string;
    users: UserEntity[];
  }
}

import { Injectable } from '@angular/core';
export type UserMeta = {
  username: string;
  roleTitle: string;
  myself: boolean;
  id: number;
  roles: any;
  role: {
    name: string;
    id: number;
  };
  email: string;
  mobilePhone: string;
  permissions: string[];
};
@Injectable()
export class MemberService {
  role: any[];
  constructor() {
    console.log('MemberService');
  }
  async addMember(items) {}
  searchUser: (search: string) => UserMeta[];
  changeRole: (item) => void;
  removeMember: (item) => void;
  queryMember: () => UserMeta[];
  quitMember: (members: UserMeta[]) => void;
}

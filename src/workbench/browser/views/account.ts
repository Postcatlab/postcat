import { Button, Component, Form, Title, Canvas, HTTPS, UserS, MessageS } from '../elements';

const userS = new UserS();
const http = new HTTPS();
const message = new MessageS();

const username = new Form({
  id: 'username',
  layout: '|',
  data: [
    {
      label: 'Username',
      isShowLabel: false,
      key: 'username',
      type: 'input',
      rules: ['required'],
    },
  ],
});

const passwordF = new Form({
  id: 'password',
  layout: '|',
  data: [
    {
      label: 'Current password',
      key: 'oldPassword',
      type: 'password',
      rules: ['required'],
    },
    {
      label: 'New password',
      key: 'newPassword',
      type: 'password',
      rules: ['required'],
    },
    {
      label: 'Confirm new password',
      key: 'confirmPassword',
      type: 'password',
      rules: ['required'],
    },
  ],
});

export default new Component({
  id: 'account',
  imports: [],
  init: [username.patch('username', userS.get('userProfile?.username'))], // TODO 需要用 vm 替换
  children: [
    new Title({ label: 'Account', class: ['font-bold', 'text-lg', 'mb-2'] }),
    new Title({ label: 'Username', class: ['font-bold', 'text-base', 'mb-2'], id: 'eoapi-account-username' }),
    new Canvas({
      class: ['w-1/2'],
      children: [
        username,
        new Button({
          id: 'save-username',
          class: ['w-[120px]'],
          label: {
            text: 'Save',
          },
          event: {
            click: [
              username.getValue('username', 'user'),
              `const [data, err]:any = await this.api.api_userUpdateUserProfile({ username: user, avatar: '111' });
                if (err) {
                  return;
                }`,
              http.send('api_userReadProfile', null, { err: 'pErr', data: 'pData' }),
              userS.setUserProfile('pData'),
              message.success('username update success !'),
            ],
          },
        }),
        new Canvas({ class: ['h-4'] }),
      ],
    }),
    new Title({ label: 'Password', class: ['font-bold', 'text-base', 'mb-2'], id: 'eoapi-account-password' }),
    new Canvas({
      class: ['w-1/2'],
      children: [passwordF],
    }),
    new Button({
      id: 'reset-btn',
      class: ['w-[120px]'],
      label: {
        text: 'Reset',
      },
      event: {
        click: [
          // * Diff old & new password is same
          // * check the Current password is right ?
          // * update new password
          passwordF.getValue('oldPassword', 'oldPassword'),
          passwordF.getValue('newPassword', 'newPassword'),
          `const [data, err]:any = await this.api.api_userUpdatePsd({ oldPassword, newPassword });
          if (err) {
            return;
          }`,
          message.success('Password reset success !'),
          passwordF.reset(),
        ],
      },
    }),
    new Canvas({ class: ['h-4'] }),
    userS,
    http,
    message,
  ],
});

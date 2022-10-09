import { Button, Component, Form, Title, Canvas, HTTPS, UserS, MessageS } from '../elements';

const userS = new UserS();
const httpS = new HTTPS();
const message = new MessageS();

const usernameF = new Form({
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
  footer: [
    {
      id: 'save-username',
      class: ['w-[84px]'],
      label: {
        text: 'Save',
      },
      attr: {
        type: 'submit',
      },
      event: {
        click: [
          Form.getValue('username', 'username', 'user'),
          httpS.send('api_userUpdateUserProfile', '{ username: user }', {
            errTip: 'Sorry, username is be used',
          }),
          httpS.send('api_userReadProfile', null, { err: 'pErr', data: 'pData' }),
          userS.setUserProfile('pData'),
          message.success('Username update success !'),
        ],
      },
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
      rules: ['required', 'isEqual:newPassword', 'minlength:6', 'maxlength:11'],
    },
  ],
  footer: [
    {
      id: 'reset-btn',
      class: ['w-[84px]'],
      attr: {
        type: 'submit',
      },
      label: {
        text: 'Reset',
      },
      event: {
        click: [
          // * Diff old & new password is same
          // * update new password
          Form.getValue('password', 'oldPassword', 'oldPassword'),
          Form.getValue('password', 'newPassword', 'newPassword'),
          httpS.send('api_userUpdatePsd', '{ oldPassword, newPassword }', { errTip: 'Validation failed' }),
          message.success('Password reset success !'),
          Form.reset('password'),
        ],
      },
    },
  ],
});

export default new Component({
  id: 'account',
  imports: [],
  init: [usernameF.patch('username', userS.get('userProfile?.username'))], // TODO 需要用 vm 替换
  children: [
    new Title({ label: 'Account', class: ['font-bold', 'text-lg', 'mb-2'] }),
    new Title({ label: 'Username', class: ['font-bold', 'text-base', 'mb-2'], id: 'eoapi-account-username' }),
    new Canvas({
      class: ['w-1/2'],
      children: [usernameF, new Canvas({ class: ['h-4'] })],
    }),
    new Title({ label: 'Password', class: ['font-bold', 'text-base', 'mb-2'], id: 'eoapi-account-password' }),
    new Canvas({
      class: ['w-1/2'],
      children: [passwordF],
    }),
    new Canvas({ class: ['h-4'] }),
    userS,
    httpS,
    message,
  ],
});

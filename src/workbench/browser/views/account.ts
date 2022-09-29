import { Button, Component, Form, Title, Canvas, UserS } from '../elements';

const userS = new UserS();

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

export default new Component({
  id: 'account',
  imports: [],
  init: [username.patch('username', userS.get('userInfo.username'))], // TODO 需要用 vm 替换
  children: [
    new Title({ label: 'Account', class: ['font-bold', 'text-lg', 'mb-2'] }),
    new Title({ label: 'Username', class: ['font-bold', 'text-base', 'mb-2'] }),
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
              // * Diff old & new password is same
              // * check the Current password is right ?
              // * update new password
            ],
          },
        }),
        new Canvas({ class: ['h-4'] }),
      ],
    }),
    new Title({ label: 'Password', class: ['font-bold', 'text-base', 'mb-2'] }),
    new Canvas({
      class: ['w-1/2'],
      children: [
        new Form({
          id: 'password',
          layout: '|',
          data: [
            {
              label: 'Current password',
              key: 'a',
              type: 'password',
              rules: ['required'],
            },
            {
              label: 'New password',
              key: 'b',
              type: 'password',
              rules: ['required'],
            },
            {
              label: 'Confirm new password',
              key: 'c',
              type: 'password',
              rules: ['required'],
            },
          ],
        }),
      ],
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
        ],
      },
    }),
    new Canvas({ class: ['h-4'] }),
    userS,
  ],
});

import { Button, Component, Form, Title, Canvas } from '../../../elements';
// const userHeader = new UserHeader({

// })

export default new Component({
  id: 'account',
  imports: [],
  init: [],
  children: [
    new Title({ label: 'Account', class: ['font-bold', 'text-lg', 'mb-2'] }),
    new Title({ label: 'Username', class: ['font-bold', 'text-base', 'mb-2'] }),
    new Canvas({
      class: ['w-1/2'],
      children: [
        new Form({
          id: 'username',
          layout: '|',
          data: [
            {
              label: 'Current password',
              key: 'a',
              type: 'password',
              rules: ['required'],
            },
          ],
        }),
        new Button({
          id: 'save-username',
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
  ],
});

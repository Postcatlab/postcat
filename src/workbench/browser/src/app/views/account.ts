import { Button, Component, Form } from '../elements';
// const userHeader = new UserHeader({

// })

export default new Component({
  id: 'account',
  imports: [],
  init: [],
  children: [
    //   userHeader,
    new Form({
      id: 'password',
      layout: '|',
      data: [
        {
          label: 'Current password',
          type: 'password',
          rules: ['required'],
        },
        {
          label: 'New password',
          type: 'password',
          rules: ['required'],
        },
        {
          label: 'Confirm new password',
          type: 'password',
          rules: ['required'],
        },
      ],
    }),
    new Button({
      id: 'change',
      label: {
        text: 'Change',
      },
      event: {
        click: [
          // * Diff old & new password is same
          // * check the Current password is right ?
          // * update new password
        ],
      },
    }),
  ],
});

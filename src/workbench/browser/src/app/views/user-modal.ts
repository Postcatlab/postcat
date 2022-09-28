import { Modal, Form, Button, Component, Text, EventS } from '../elements';

const retry = new Modal({
  id: 'retry',
  title: { text: 'Do you want to upload local data to the cloud ?' },
  children: [
    new Text({
      label: {
        text: 'After confirmation, a cloud space will be created and the local data will be uploaded',
      },
    }),
  ],
  footer: [],
});

// * 登录弹窗
const login = new Modal({
  id: 'login',
  title: {
    text: 'Login',
  },
  children: [
    new Form({
      id: 'username',
      data: [
        {
          label: 'Email/Phone',
          type: 'input',
          class: '',
          placeholder: 'Enter env name',
          rules: ['required'],
        },
        {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter env host',
          rules: ['required'],
        },
      ],
    }),
    new Button({
      id: 'login-btn',
      label: { text: 'Sign In/Up' },
      event: {
        click: [retry.wakeUp()],
      },
    }),
  ],
  footer: [],
});

const openSetting = new Modal({
  id: 'open-setting',
  title: {
    text: 'Open setting',
  },
  children: [
    new Text({
      label: [
        { text: 'If you want to collaborate, please' },
        { text: 'open the settings', type: 'link' },
        { text: 'and fill in the configuration' },
      ],
    }),
  ],
  footer: [],
});

const checkConnect = new Modal({
  id: 'check-connect',
  title: { text: 'Check your connection' },
  children: [
    new Text({
      label: `Can 't connect right now, click to retry`,
    }),
  ],
  footer: [],
});

const event = new EventS({
  id: 'event',
  listen: [
    {
      name: 'login',
      callback: [login.wakeUp()],
    },
  ],
});

export default new Component({
  id: 'user-modal',
  imports: [],
  init: [],
  children: [event, retry, checkConnect, login, openSetting],
});

import { Modal, Form, Button, Component, Text, Input, EventS, HTTPS } from '../elements';

const http = new HTTPS();

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

const userPassForm = new Form({
  id: 'username',
  data: [
    {
      label: 'Email/Phone',
      key: 'username',
      type: 'input',
      class: '',
      placeholder: 'Enter username',
      rules: ['required'],
    },
    {
      label: 'Password',
      key: 'password',
      type: 'password',
      placeholder: 'Enter password',
      rules: ['required'],
    },
  ],
});

const addWorkspace = new Modal({
  id: 'add-workspace',
  title: { text: 'Create Workspace' },
  children: [
    new Input({
      id: 'workspace-name',
      placeholder: 'Workspace Name',
    }),
  ],
  footer: [
    new Button({
      id: 'cancel-btn',
      label: { text: 'cancel' },
      event: {},
    }),
    new Button({
      id: 'confirm-btn',
      label: { text: 'confirm' },
      event: {},
    }),
  ],
});

// * 登录弹窗
const login = new Modal({
  id: 'login',
  title: {
    text: 'Login',
  },
  children: [
    userPassForm,
    new Button({
      id: 'login-btn',
      label: { text: 'Sign In/Up' },
      event: {
        click: [
          // * login
          userPassForm.getData('formData'),
          http.send('api_authLogin', 'formData'),
          Modal.close('login'),
          retry.wakeUp(),
        ],
      },
    }),
  ],
  footer: [],
  event: {
    close: [userPassForm.reset()],
  },
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
    {
      name: 'logOut',
      callback: [
        () => {
          const refreshTokenExpiresAt = '2333';
        },
        http.send('api_authLogout', '{ refreshTokenExpiresAt }'),
      ],
    },
    { name: 'addWorkspace', callback: [addWorkspace.wakeUp()] },
  ],
});

export default new Component({
  id: 'user-modal',
  imports: [],
  init: [],
  children: [http, event, retry, checkConnect, login, openSetting, addWorkspace],
});

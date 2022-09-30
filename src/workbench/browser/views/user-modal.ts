import { Alert } from 'eo/workbench/browser/elements/alert';
import workspace from 'eo/workbench/browser/views/workspace';
import {
  Modal,
  Form,
  Button,
  Component,
  MessageS,
  Canvas,
  Text,
  Input,
  UserS,
  EventS,
  WorkspaceS,
  HTTPS,
} from '../elements';

const userS = new UserS();
const httpS = new HTTPS();
const message = new MessageS();
const workspaceS = new WorkspaceS();

const sync = new Modal({
  id: 'sync',
  title: { text: 'Do you want to upload local data to the cloud ?' },
  children: [
    new Text({
      label: {
        text: 'After confirmation, the system will create a cloud space to upload the local data to the cloud.',
      },
    }),
    new Alert({ text: 'Subsequent local space and cloud space are no longer synchronized' }),
  ],
  footer: [
    {
      label: 'Cancel',
      type: 'default',
      click: [Modal.close('sync')],
    },
    {
      label: 'Sync',
      type: 'primary',
      click: [
        workspaceS.exportProjectData('eData'),
        httpS.send('api_workspaceUpload', 'eData'),
        (data) => {
          const { workspace } = data;
          const { id } = workspace;
        },
        workspaceS.getWorkspaceList('list'),
        workspaceS.setWorkspaceList('[...list, workspace]'),
        workspaceS.setCurrentWorkspaceID('id'),
        Modal.close('sync'),
      ],
    },
  ],
});

const userPassForm = new Form({
  id: 'username',
  data: [
    {
      label: 'Email/Phone',
      isShowLabel: false,
      key: 'username',
      type: 'input',
      class: '',
      placeholder: 'Enter Enter Email/Phone/Username',
      rules: ['required'],
    },
    {
      label: 'Password',
      isShowLabel: false,
      key: 'password',
      type: 'password',
      placeholder: 'Enter password',
      rules: ['required'],
    },
  ],
});

const newWorkspaceName = new Input({
  id: 'workspace-name',
  placeholder: 'Workspace Name',
});

const addWorkspace = new Modal({
  id: 'add-workspace',
  title: { text: 'Add Workspace' },
  children: [newWorkspaceName],
  footer: [
    {
      label: 'Cancel',
      type: 'default',
      click: [Modal.close('add-workspace')],
      disabled: [],
    },
    {
      label: 'Add',
      type: 'primary',
      click: [
        newWorkspaceName.getValue('title'),
        `
        const [data, err]:any = await this.api.api_workspaceCreate({title})
        if(err) {
          return
        }
        `,
        message.success('Create new workspace successfully !'),
        Modal.close('add-workspace'),
        newWorkspaceName.reset(),
        // * update workspace list
        httpS.send('api_workspaceList', '{}', { err: 'wErr', data: 'list' }),
        workspaceS.setWorkspaceList('list'),
      ],
      disabled: [],
    },
  ],
});

// * 登录弹窗
const login = new Modal({
  id: 'login',
  width: 400,
  title: {
    text: 'Sign In/Up',
  },
  children: [
    new Canvas({
      class: ['my-3'],
      children: [
        userPassForm,
        new Canvas({
          class: ['h-2'],
        }),
        new Button({
          id: 'login-btn',
          label: { text: 'Sign In/Up' },
          theme: ['block'],
          class: ['h-10'],
          event: {
            click: [
              // * login
              userPassForm.getData('formData'),
              httpS.send('api_authLogin', 'formData', {
                errTip: 'Authentication failed !',
              }),
              userS.setLoginInfo('data'),
              Modal.close('login'),
              httpS.send('api_userReadProfile', null, { err: 'pErr', data: 'pData' }),
              userS.setUserProfile('pData'),
              sync.wakeUp(),
            ],
          },
        }),
      ],
    }),
  ],
  footer: [],
  event: {
    //!TODO modal control self status，no need to reset
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
        userS.getKey('refreshToken'),
        `const [data, err]:any = await this.api.api_authLogout({ refreshToken });
        if (err) {
          return;
        }`,
        userS.setUserProfile('{ id: -1, password:"", username:"", workspaces:[] }'),
        message.success('Successfully logged out !'),
      ],
    },
    { name: 'addWorkspace', callback: [addWorkspace.wakeUp()] },
  ],
});

const updateWorkspace = [
  workspaceS.getCurrent('{ id: workspaceID }'),
  // httpS.send('api_workspaceMember', '{ workspaceID }', { err: 'wErr', data: 'wData' }), // * 获取空间成员列表
  // workspaceS.setWorkspaceList('wData'),
  httpS.send('api_workspaceList', '{}', { err: 'wErr', data: 'list' }),
  workspaceS.setWorkspaceList('list'),
];

export default new Component({
  id: 'user-modal',
  imports: [],
  init: [...updateWorkspace, openSetting.wakeUp()],
  children: [httpS, userS, message, event, sync, checkConnect, login, openSetting, workspaceS, addWorkspace],
});

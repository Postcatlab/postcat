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
  Alert,
  // ModalS,
  DataSourceS,
  ProjectS,
} from '../elements';

const userS = new UserS();
const httpS = new HTTPS();
// const modalS = new ModalS();
const messageS = new MessageS();
const workspaceS = new WorkspaceS();
const dataSourceS = new DataSourceS();
const projectS = new ProjectS();

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
        // projectS.exportProjectData('eData'),
        `
        const eData = await this.project.exportLocalProjectData()
        `,
        httpS.send('api_workspaceUpload', 'eData'),
        (data) => {
          const { workspace } = data;
        },
        workspaceS.getWorkspaceList('list'),
        workspaceS.setWorkspaceList('[...list, workspace]'),
        workspaceS.setCurrentWorkspaceID('workspace'),
        Modal.close('sync'),
      ],
    },
  ],
});

const loginForm = new Form({
  id: 'login',
  data: [
    {
      label: 'Email/Phone',
      isShowLabel: false,
      key: 'username',
      type: 'input',
      class: '',
      placeholder: 'Enter Email/Phone/Username',
      rules: ['required'],
    },
    {
      label: 'Password',
      isShowLabel: false,
      key: 'password',
      type: 'password',
      placeholder: 'Enter password',
      rules: ['required', 'minlength:6'],
    },
  ],
  footer: [
    {
      id: 'login-btn',
      label: { text: 'Sign In/Up' },
      theme: ['block'],
      class: ['h-10', 'mt-2'],
      attr: {
        type: 'submit',
      },
      event: {
        click: [
          // * login
          Form.isOk('login'),
          `
          if(!isOk) {
            ${messageS.error('Please check you username or password')}
            return
          }`,
          Form.getData('login', 'formData'),
          httpS.send('api_authLogin', 'formData', {
            errTip: 'Authentication failed !',
          }),
          userS.setLoginInfo('data'),
          Modal.close('login'),
          [httpS.send('api_userReadProfile', null), userS.setUserProfile('data')],
          [
            // * update workspace
            httpS.send('api_workspaceList', '{}'),
            workspaceS.setWorkspaceList('data'),
          ],
          `
          if (!data.isFirstLogin) {
            return
          }
          `,
          sync.wakeUp(),
        ],
      },
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
      label: 'Save',
      type: 'primary',
      click: [
        newWorkspaceName.getValue('title'),
        [httpS.send('api_workspaceCreate', '{ title }')],
        messageS.success('Create new workspace successfully !'),
        Modal.close('add-workspace'),
        // * update workspace list
        [httpS.send('api_workspaceList', '{}'), workspaceS.setWorkspaceList('data')],
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
      children: [loginForm],
    }),
  ],
  footer: [],
});

// const login = modalS.component({
//   id: 'login',
//   title: 'Sign In/Up',
//   children: [
//     messageS,
//     userS,
//     httpS,
//     workspaceS,
//     new EventS({}),
//     new Canvas({
//       class: ['my-3'],
//       children: [loginForm],
//     }),
//   ],
// });

const checkConnect = new Modal({
  id: 'check-connect',
  title: { text: 'Check your connection' },
  children: [
    new Text({
      label: `Can't connect right now, click to retry or`,
    }),
    new Text({
      label: [{ text: 'config in the configuration' }],
      event: {
        click: [Modal.close('open-setting')],
      },
    }),
  ],
  footer: [
    {
      label: 'Cancel',
      type: 'default',
      click: [Modal.close('check-connect')],
    },
    {
      label: 'Retry',
      type: 'primary',
      click: [dataSourceS.ping(), Modal.close('check-connect')],
    },
  ],
});

const eventS = new EventS({
  listen: [
    {
      name: 'login',
      callback: [login.wakeUp()],
    },
    {
      name: 'clear-user',
      callback: [
        // * clear all user data
        userS.clearAuth(),
        userS.setUserProfile('{ id: -1, password:"", username:"", workspaces:[] }'),
      ],
    },
    {
      // TODO change a event name
      name: 'http-401',
      callback: [
        workspaceS.getCurrent('{ id }'),
        `if (id === -1) {
          return
        }`,
        login.wakeUp(),
      ],
    },
    {
      name: 'logOut',
      callback: [
        // * clear workspace list
        workspaceS.setCurrentWorkspaceID('-1'),
        userS.setUserProfile('{ id: -1, password:"", username:"", workspaces:[] }'),
        [workspaceS.setWorkspaceList('[]')],
        workspaceS.setCurrentWorkspace(workspaceS.getLocalWorkspaceInfo()),
        messageS.success('Successfully logged out !'),
        userS.getKey('refreshToken'),
        userS.clearAuth(),
        [httpS.send('api_authLogout', '{ refreshToken }')],
      ],
    },
    {
      name: 'ping-fail',
      callback: [messageS.error('Connect failed'), checkConnect.wakeUp()],
    },
    {
      name: 'ping-success',
      callback: [messageS.success('Connect success')],
    },
    {
      name: 'need-config-remote',
      callback: [Modal.wakeUp('open-setting')],
    },
    { name: 'addWorkspace', callback: [addWorkspace.wakeUp()] },
    { name: 'retry', callback: [checkConnect.wakeUp()] },
  ],
});

const openSetting = new Modal({
  id: 'open-setting',
  title: {
    text: 'Open setting',
  },
  children: [
    new Text({ label: [{ text: 'If you want to collaborate, please' }] }),
    new Text({
      label: [{ text: 'open the settings' }],
      event: {
        click: [eventS.send('open-setting'), Modal.close('open-setting')],
      },
    }),
    new Text({ label: [{ text: 'and fill in the configuration' }] }),
  ],
  footer: [],
});

const updateWorkspace = [
  workspaceS.getCurrent('{ id: workspaceID }'),
  [httpS.send('api_workspaceList', '{}'), workspaceS.setWorkspaceList('data')],
  // workspaceS.updateProjectID('workspaceID'),
  // TODO for now
  `if (workspaceID !== -1) {
    const { projects } = await this.workspace.getWorkspaceInfo(workspaceID);
    this.project.setCurrentProjectID(projects.at(0).uuid);
  }
  `,
];

const isConnect = [
  dataSourceS.hasUrl('url'),
  `
  if (url === '') {
    ${openSetting.wakeUp()}
    return
  }
  `,
  workspaceS.getCurrent('{ id: currentWorkspaceID }'),
  `if( currentWorkspaceID === -1) {
    return
  }`,
  dataSourceS.isConnectRemote('status'),
  `
  if (!status) {
      ${checkConnect.wakeUp()}
      return;
    }
  `,
];

export default new Component({
  id: 'user-modal',
  imports: [],
  init: [...updateWorkspace, ...isConnect],
  children: [
    httpS,
    projectS,
    dataSourceS,
    userS,
    messageS,
    eventS,
    sync,
    // modalS,
    checkConnect,
    login,
    openSetting,
    workspaceS,
    addWorkspace,
  ],
});

import {
  Form,
  Button,
  Input,
  Overview,
  //   SelectPeople,
  Component,
  Element,
  Module,
  Title,
  Line,
  Text,
  Canvas,
  ModalS,
  WorkspaceS,
  HTTPS,
  MessageS,
} from '../elements';

// const select = new SelectPeople({

// })

const modalS = new ModalS();
const messageS = new MessageS();
const httpS = new HTTPS();
const workspaceS = new WorkspaceS();

const updateWorkspace = [
  httpS.send('api_workspaceList', '{}', { err: 'wErr', data: 'list' }),
  workspaceS.setWorkspaceList('list'),
];

const wpnameF = new Form({
  id: 'wsp-name',
  layout: '|', // * 这个 | 的意思是竖向排列
  data: [
    {
      label: 'Name',
      key: 'workspace',
      type: 'input',
      class: '',
      rules: ['required'],
    },
  ],
  footer: [
    {
      id: 'save-btn',
      label: 'Save',
      event: {
        click: [
          workspaceS.getCurrent('{ id: currentWsp }'),
          Form.getValue('wsp-name', 'workspace', 'title'),
          httpS.send('api_workspaceEdit', '{ workspaceID: currentWsp, title }', {
            errTip: `Edit workspace failed`,
          }),
          messageS.success('Edit workspace successfully !'),
          ...updateWorkspace,
        ],
      },
    },
  ],
});

export default new Module({
  id: 'workspace',
  children: [
    new Component({
      id: 'workspace',
      link: true,
      imports: [],
      init: [workspaceS.getCurrent('{ title: currentWsp }'), wpnameF.patch('workspace', 'currentWsp')],
      children: [
        modalS,
        workspaceS,
        messageS,
        httpS,
        new Canvas({
          class: ['py-5', 'px-10'],
          children: [
            new Title({ label: 'Manage Workspace' }),
            new Canvas({ class: ['py-2'], children: [new Overview()] }),
            new Line(),
            new Canvas({
              class: [],
              attr: {
                '*ngIf': `
                (this.workspace.currentWorkspaceID !== -1) &&
                this.workspace.authEnum.canEdit
                `,
              },
              children: [
                new Title({ label: 'Edit Workspace', class: ['font-bold'] }),
                wpnameF,
                new Line(),
                new Title({ label: 'Delete Workspace', class: ['font-bold'] }),
                new Canvas({
                  class: ['pb-4'],
                  children: [
                    new Text({
                      label: [
                        { text: 'After deleting a workspace, all data in the workspace will be permanently deleted.' },
                      ],
                    }),
                  ],
                }),
                new Button({
                  id: 'del-wsp',
                  label: 'Delete',
                  theme: ['danger'],
                  event: {
                    click: [
                      Button.stopLoading('del-wsp'),
                      modalS.danger({
                        title: 'Deletion Confirmation?',
                        content: `Are you sure you want to delete the workspace ? \nYou cannot restore it once deleted!`,
                        okText: 'Remove',
                      }),
                      workspaceS.getCurrent('{ id: currentWsp }'),
                      httpS.send('api_workspaceDelete', '{ workspaceID: currentWsp }'),
                      messageS.success('Delete success !'),
                      // * update workspace
                      workspaceS.setLocalSpace(),
                      ...updateWorkspace,
                    ],
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

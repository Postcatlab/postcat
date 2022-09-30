import {
  Modal,
  Form,
  Button,
  Input,
  Title,
  ManageAccess,
  Component,
  Canvas,
  Module,
  EventS,
  HTTPS,
  WorkspaceS,
  MessageS,
  ModalS,
} from '../elements';

const personInput = new Input({ id: 'person', placeholder: 'Search by username' });
const httpS = new HTTPS();
const modalS = new ModalS();
const workspaceS = new WorkspaceS();
const messageS = new MessageS();

const updateMember = [
  workspaceS.getCurrent('{ id: currentWorkspaceID }'),
  // * 获取空间成员列表
  httpS.send('api_workspaceMember', '{ workspaceID: currentWorkspaceID }', { err: 'wErr', data: 'wData' }),
  workspaceS.setWorkspaceList('wData'),
  ManageAccess.setList('wData'),
];

const manageAccess = new ManageAccess({
  event: {
    eoOnRemove: {
      params: ['$event'],
      callback: [
        modalS.danger({ title: 'Warning', content: 'Are you sure you want to remove the menmber ?' }),
        // * 删除成员，并更新成员列表
        workspaceS.getCurrent('{ id: workspaceID }'),
        ($event) => {
          const { id } = $event;
        },
        httpS.send('api_workspaceRemoveMember', '{ workspaceID, userIDs: [id] }'),
        ...updateMember,
      ],
    },
  },
});

const invate = new Modal({
  id: 'invate',
  title: {
    text: 'Add people to the workspace',
  },
  children: [
    personInput,
    new Canvas({ class: ['h-4'] }),
    new Button({
      id: 'select',
      label: {
        text: 'Select a member above',
      },
      theme: ['block'],
      status: {
        disabled: [personInput.isEmpty()],
      },
      event: {
        click: [
          personInput.getValue('username'),
          // * 根据用户名找用户ID
          httpS.send('api_userSearch', '{ username }', { err: 'uErr', data: 'uData' }),
          `
            if (uData.length === 0) {
              this.eMessage.error($localize\`Could not find a user matching \${username}\`)
              return;
            }
            const [user] = uData;
            const { id } = user;
            `,
          workspaceS.getCurrent('{ id:workspaceID }'),
          // * 添加成员
          httpS.send('api_workspaceAddMember', '{ workspaceID, userIDs:[id] }', { data: 'aData', err: 'aErr' }),
          messageS.success('Add new member success'),
          Modal.close('invate'),
          ...updateMember,
        ],
      },
    }),
  ],
  event: {
    close: [personInput.reset()],
  },
  footer: [],
});

const addPeople = new Button({
  id: 'add-people',
  label: 'Add people',
  event: {
    click: [invate.wakeUp()],
  },
});

export default new Module({
  id: 'member',
  children: [
    new Component({
      id: 'member',
      link: true,
      imports: [
        {
          target: [{ name: 'SharedModule', type: 'module' }],
          from: 'eo/workbench/browser/src/app/shared/shared.module',
        },
        {
          target: [{ name: 'ManageAccessComponent', type: 'component' }],
          from: 'eo/workbench/browser/src/app/shared/components/manage-access/manage-access.component',
        },
      ],
      init: [...updateMember],
      children: [
        invate,
        httpS,
        workspaceS,
        modalS,
        new Canvas({
          class: ['py-5', 'px-10'],
          children: [
            new Title({
              label: 'Manage access',
              children: [addPeople],
            }),
            new Canvas({
              class: ['py-5'],
              children: [manageAccess],
            }),
          ],
        }),
      ],
    }),
  ],
});

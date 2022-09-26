import {
  Modal,
  Form,
  Button,
  Input,
  //   SelectPeople,
  Component,
  Module,
  Text,
  //   EventS,
} from '../elements';

const invate = new Modal({
  id: 'invate',
  title: {
    text: 'Add people to the space',
  },
  children: [
    new Input({}),
    new Button({
      id: 'select',
      label: {
        text: 'Select a member above',
      },
      event: [],
    }),
  ],
  footer: [],
});

// const select = new SelectPeople({

// })

export default new Module({
  id: 'workspace',
  children: [
    new Component({
      id: 'workspace',
      link: true,
      imports: [],
      init: [],
      children: [
        new Text({ label: 'Workspace Operate', type: 'title' }),
        new Text({ label: 'Edit Workspace', type: 'title' }),
        new Button({
          id: 'save-btn',
          label: 'Save',
          event: {
            click: [],
          },
        }),
        new Text({ label: 'Delete Workspace', type: 'title' }),
        new Button({
          id: 'del-wsp',
          label: 'Delete',
          theme: 'danger',
          event: {
            click: [],
          },
        }),
      ],
    }),
  ],
});

import {
  Modal,
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
  //   EventS,
} from '../../../elements';

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
        new Canvas({
          class: ['py-5', 'px-10'],
          children: [
            new Title({ label: 'Workspace Operate' }),
            new Canvas({ class: ['py-2'], children: [new Overview()] }),
            new Line(),
            new Title({ label: 'Edit Workspace' }),
            new Form({
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
            }),
            new Button({
              id: 'save-btn',
              label: 'Save',
              event: {
                click: [],
              },
            }),
            new Line(),
            new Title({ label: 'Delete Workspace' }),
            new Text({
              label: [{ text: 'After deleting a workspace, all data in the workspace will be permanently deleted.' }],
            }),
            new Button({
              id: 'del-wsp',
              label: 'Delete',
              theme: ['danger'],
              event: {
                click: [],
              },
            }),
          ],
        }),
      ],
    }),
  ],
});

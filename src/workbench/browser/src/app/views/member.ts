import {
  Modal,
  Form,
  Button,
  Input,
  Title,
  //   SelectPeople,
  Component,
  Canvas,
  Module,
  EventS,
} from '../../../elements';

const personInput = new Input({ id: 'person', placeholder: 'Search by username' });

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
          personInput.getValue('data'),
          (data) => {
            console.log(data);
          },
        ],
      },
    }),
  ],
  event: {
    close: [personInput.reset()],
  },
  footer: [],
});

// const select = new SelectPeople({

// })

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
      imports: [],
      init: [],
      children: [
        invate,
        new Canvas({
          class: ['py-5', 'px-10'],
          children: [
            new Title({
              label: 'Manage access',
              children: [addPeople],
            }),
          ],
        }),
      ],
    }),
  ],
});

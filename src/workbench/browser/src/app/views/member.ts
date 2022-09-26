import {
  Modal,
  Form,
  Button,
  Input,
  //   SelectPeople,
  Component,
  Module,
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
  id: 'member',
  children: [
    new Component({
      id: 'member',
      link: true,
      imports: [],
      init: [],
      children: [invate],
    }),
  ],
});

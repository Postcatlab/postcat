import {
  Form,
  Button,
  Input,
  Overview,
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
  ApiContent,
} from '../elements';

export default new Module({
  id: 'share',
  children: [
    new Component({
      id: 'share',
      imports: [],
      init: [],
      children: [
        new Canvas({
          class: ['flex', 'flex-col', 'w-[300px]', 'px-2'],
          children: [new ApiContent()],
        }),
      ],
    }),
  ],
});

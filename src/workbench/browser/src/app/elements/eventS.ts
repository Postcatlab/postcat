import { Render } from 'ecode/dist/render';

const renderEvent = (list) =>
  list
    .map(
      ({ name, callback }) => `
    if(type === '${name}') {
        ${callback.map(Render.callbackRender)}
        return 
    }
    `
    )
    .join('\n');

export class EventS extends Render {
  listen;
  constructor({ id, listen = [] }) {
    super({ children: [] });
    this.listen = `this.message.get().subscribe(async ({ type, data }) => {
        ${renderEvent(listen)}
      });
      `;
  }
  send(name) {
    return `this.message.send({type: ${name}})`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'MessageService', type: 'service', inject: { name: 'message' } }],
          from: 'eo/workbench/browser/src/app/shared/services/message/message.service',
        },
      ],
      init: [this.listen],
      template: '',
      data: [],
      methods: [],
    };
  }
}

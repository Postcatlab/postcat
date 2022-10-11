import { Render } from 'ecode/dist/render';

const renderEvent = (list) =>
  list
    .map(
      ({ name, callback }) => `
    if(type === '${name}') {
        ${callback.map(Render.callbackRender).join('\n')}
        return 
    }
    `
    )
    .join('\n');

export class EventS extends Render {
  listen;
  constructor({ listen = [] }) {
    super({ children: [] });
    this.listen = `this.message.get().pipe(distinct(({ type }) => type, interval(400))).subscribe(async ({ type, data }) => {
        ${renderEvent(listen)}
      });
      `;
  }
  send(name, data = '{}') {
    return `this.message.send({type: '${name}', data: ${data}})`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'MessageService', type: 'service', inject: { name: 'message' } }],
          from: 'eo/workbench/browser/src/app/shared/services/message/message.service',
        },
        {
          target: [{ name: 'distinct', type: 'base' }],
          from: 'rxjs/operators',
        },
        {
          target: [{ name: 'interval', type: 'base' }],
          from: 'rxjs',
        },
      ],
      init: [this.listen],
      template: '',
      data: [],
      methods: [],
    };
  }
}

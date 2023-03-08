export const SYNC_API_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    __crontab: {
      type: 'number',
      label: $localize`Auto Sync`,
      ui: {
        widget: 'radio'
      },
      default: 4,
      required: true,
      oneOf: [
        {
          type: 'number',
          title: $localize`Off`,
          default: 0,
          const: 0
        },
        {
          type: 'number',
          title: $localize`Every four hours`,
          default: 4,
          const: 4
        },
        {
          type: 'number',
          title: $localize`Every twelve hours`,
          default: 12,
          const: 12
        },
        {
          type: 'number',
          title: $localize`Every day`,
          default: 24,
          const: 24
        }
      ]
    },
    __formater: {
      type: 'string',
      label: $localize`:@@SyncFormat:Format`,
      ui: {
        widget: 'radio'
      },
      default: '',
      required: true,
      oneOf: []
    }
  },
  allOf: []
};

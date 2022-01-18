const { xml2json, form2json, parseTree } = require('../src/app/utils/tree');

describe('test the xml2json', () => {
  test('base', () => {
    const xml = `
    <out attr="happy">
        out
        <in attr="sad">
            in
        </in>
        out
    </out>`;
    const result = [
      {
        tagName: 'out',
        attr: 'attr="happy"',
        content: '\nout\nout',
        children: [
          {
            tagName: 'in',
            attr: 'attr="sad"',
            content: '\nin',
            children: [],
          },
        ],
      },
    ];
    const json = xml2json(xml);
    expect(json).toEqual(result);
  });
  test('<?xml ... ?>', () => {
    const xml = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <root>
        <type version="1.0">projectMember</type>
        <statusCode version="{{globalParams}}">000000</statusCode>
        <memberList>
            <connID>2787</connID>
            <memberNickName></memberNickName>
            <inviteCall>2177295417@qq.com</inviteCall>
            <userNickName>[随机]无崖子</userNickName>
            <userImage></userImage>
        </memberList>
    </root>
    `;
    const result = [
      {
        tagName: 'root',
        attr: '',
        content: '\n\n\n\n',
        children: [
          {
            tagName: 'type',
            attr: 'version="1.0"',
            content: 'projectMember',
            children: [],
          },
          {
            tagName: 'statusCode',
            attr: 'version="{{globalParams}}"',
            content: '000000',
            children: [],
          },
          {
            tagName: 'memberList',
            attr: '',
            content: '\n\n\n\n\n\n',
            children: [
              {
                tagName: 'connID',
                attr: '',
                content: '2787',
                children: [],
              },
              {
                tagName: 'memberNickName',
                attr: '',
                content: '',
                children: [],
              },
              {
                tagName: 'inviteCall',
                attr: '',
                content: '2177295417@qq.com',
                children: [],
              },
              {
                tagName: 'userNickName',
                attr: '',
                content: '[随机]无崖子',
                children: [],
              },
              {
                tagName: 'userImage',
                attr: '',
                content: '',
                children: [],
              },
            ],
          },
        ],
      },
    ];
    const json = xml2json(xml);
    expect(json).toEqual(result);
  });
  test('empty', () => {
    const xml = `
    `;
    const result = [];
    const json = xml2json(xml);
    expect(json).toEqual(result);
  });
});

describe('test form2json', () => {
  test('base', () => {
    const form = `
    cache-control: no-cache
    content-encoding: gzip
    content-type: application/json; charset=utf-8
    date: Thu, 13 Jan 2022 03:04:20 GMT
    lb: 180.149.153.242
    proc_node: v8core-1-5d48ffd84b-v6q8q
    server: nginx
    ssl_node: ssl-015.mweibo.yf.intra.weibo.cn
    vary: Accept-Encoding
    x-powered-by: PHP/7.2.1
    `;
    const result = [
      {
        key: 'cache-control',
        value: 'no-cache',
      },
      {
        key: 'content-encoding',
        value: 'gzip',
      },
      {
        key: 'content-type',
        value: 'application/json; charset=utf-8',
      },
      {
        key: 'date',
        value: 'Thu, 13 Jan 2022 03',
      },
      {
        key: 'lb',
        value: '180.149.153.242',
      },
      {
        key: 'proc_node',
        value: 'v8core-1-5d48ffd84b-v6q8q',
      },
      {
        key: 'server',
        value: 'nginx',
      },
      {
        key: 'ssl_node',
        value: 'ssl-015.mweibo.yf.intra.weibo.cn',
      },
      {
        key: 'vary',
        value: 'Accept-Encoding',
      },
      {
        key: 'x-powered-by',
        value: 'PHP/7.2.1',
      },
    ];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
  test('empty value', () => {
    const form = `multiple:multiple
    multiple:
    test1:
    file:
    formDataStructure:formDataStructure
    formDataStructure:
    formDataStructure:formDataStructure
    formDataStructure:
    a:
    `;
    const result = [
      { key: 'multiple', value: 'multiple' },
      { key: 'multiple', value: '' },
      { key: 'test1', value: '' },
      { key: 'file', value: '' },
      { key: 'formDataStructure', value: 'formDataStructure' },
      { key: 'formDataStructure', value: '' },
      { key: 'formDataStructure', value: 'formDataStructure' },
      { key: 'formDataStructure', value: '' },
      { key: 'a', value: '' },
    ];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
  test('empty', () => {
    const form = `
    `;
    const result = [];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
});

describe('test the parseTree', () => {
  test('base', () => {
    const data = {
      string: '',
      array: [
        {
          dom1: {},
          dom2: false,
          dom3: [],
        },
      ],
      object: {
        dom1: '',
        dom2: 0,
      },
      null: null,
      float: 11.11,
      int: 1,
      boolean: false,
    };
    const result = [
      {
        name: 'string',
        value: '',
        description: '',
        type: 'string',
        required: true,
        example: '',
        listDepth: 0,
      },
      {
        name: 'array',
        required: true,
        example: '',
        type: 'array',
        description: '',
        listDepth: 0,
        children: [
          {
            name: 'dom1',
            required: true,
            example: '',
            type: 'object',
            description: '',
            listDepth: 1,
            children: [],
          },
          {
            name: 'dom2',
            value: false,
            description: '',
            type: 'boolean',
            required: true,
            example: '',
            listDepth: 1,
          },
          {
            name: 'dom3',
            required: true,
            example: '',
            type: 'array',
            description: '',
            listDepth: 1,
            children: [],
          },
        ],
      },
      {
        name: 'object',
        required: true,
        example: '',
        type: 'object',
        description: '',
        listDepth: 0,
        children: [
          {
            name: 'dom1',
            value: '',
            description: '',
            type: 'string',
            required: true,
            example: '',
            listDepth: 1,
          },
          {
            name: 'dom2',
            value: 0,
            description: '',
            type: 'number',
            required: true,
            example: '',
            listDepth: 1,
          },
        ],
      },
      {
        name: 'null',
        value: null,
        description: '',
        type: 'null',
        required: true,
        example: '',
        listDepth: 0,
      },
      {
        name: 'float',
        value: 11.11,
        description: '',
        type: 'number',
        required: true,
        example: 11.11,
        listDepth: 0,
      },
      {
        name: 'int',
        value: 1,
        description: '',
        type: 'number',
        required: true,
        example: 1,
        listDepth: 0,
      },
      {
        name: 'boolean',
        value: false,
        description: '',
        type: 'boolean',
        required: true,
        example: '',
        listDepth: 0,
      },
    ];
    expect(Object.keys(data).map((it) => parseTree(it, data[it]))).toEqual(result);
  });
});
